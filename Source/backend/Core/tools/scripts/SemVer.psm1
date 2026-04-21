$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Import-Module $ScriptDir/Synchronous-ZipAndUnzip.psm1

function Invoke-SemVer()
{
  $tmp = [System.IO.Path]::GetRandomFileName()
  $exe = Get-SemVer | Select-Object -Last 1
  Write-Host "Located binary at $exe"
  $arglist = "--env --confirm --output $tmp --changelog=./CHANGELOG.md"
  Start-Process -FilePath $exe -ArgumentList $arglist -NoNewWindow -Wait
  $res = Get-Content $tmp | Out-String
  # Clean up
  Remove-Item -Path $tmp -Recurse -Force
  # Set environment
  Invoke-Expression ($res)
}

function Get-SemVer()
{
  # Download new binaries if needed
  $svnSemVerDir = "$env:LocalAppData\Ociane\SvnSemVer\"
  $svnSemVerBinDir = "$env:LocalAppData\Ociane\SvnSemVer\bin\"
  $exe = Get-ChildItem -Path $svnSemVerBinDir -Filter *.exe
  Write-Host "Downloading Latest SvnSemver zips"
  Download-Tool http://dev.ociane.fr:3690/svn/Dev/_/Tools/SvnSemVer/deliverables/ $svnSemVerDir
  $zipFile = Get-ChildItem "$svnSemVerDir/*.zip" | Sort-Object $_.Name | Select-Object -Last 1
  # test if no exe file present
  if ($exe -eq $null) {
    Write-Host "SvnSemver.exe not found, extracting latest ($zipFile)"
    # calculate latest zip file version, extract only if necessary
    Write-Host "Extract $zipFile to $svnSemVerBinDir"
    Expand-ZipFile -ZipFilePath $zipFile -DestinationDirectoryPath $svnSemVerBinDir -Force
    $exe = Get-ChildItem -Path $svnSemVerBinDir -Filter *.exe | Select-Object -Last 1
    Write-Host "SvnSemver.exe downloaded and extracted"
    Write-Host "Found: $($exe.FullName)"
  } else {
    # Calculate exe file version
    $semverversion =  [System.Diagnostics.FileVersionInfo]::GetVersionInfo($exe.FullName).FileVersion
    $versionparts = $semverversion.Split(".")
    $cleanversion = $versionparts[0..2] -Join "."
    $zipversion = $zipfile.Name.Split("-")[1]
    $zipversionparts = $zipversion.Split(".")
    $cleanzip = $zipversionparts[0..2] -Join "."
    if ($cleanversion -eq $cleanzip) {
      Write-Host "You have the latest svnsemver release"
    } else {
      Write-Host "Current SvnSemver binary version $cleanversion, latest is $cleanzip, updating your binary"
      Expand-ZipFile -ZipFilePath $zipFile -DestinationDirectoryPath $svnSemVerBinDir -Force
      $exe = Get-ChildItem -Path $svnSemVerBinDir -Filter *.exe | Select-Object -Last 1
    }
  }
  return $exe.FullName
}

function Download-Tool($svnRemotePath, $out)
{
  if (-not (Test-Path $out)) {
    & svn checkout $svnRemotePath $out
  } else {
    & svn update $out
    if ($?) {
      Write-Host "binaries are up to date"
    } else {
      Remove-Item -Path $out -Recurse -Force
      Write-Host "Something went wrong, deleting $out and trying again"
      Download-Tool $svnRemotePath $out
    }
  }
}

Export-ModuleMember -Function Get-SemVer,Invoke-SemVer
