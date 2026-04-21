$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Import-Module $ScriptDir/Archive.psm1

function Invoke-DocFxMetadata()
{
  $exe = Get-DocFx
  & "$exe" metadata
}

function Invoke-DocFxBuild()
{
  $exe = Get-DocFx
  & "$exe" build
}

function Invoke-DocFxServe()
{
  $exe = Get-DocFx
  & "$exe" serve
}

function Get-DocFx()
{
  $docFxDir = "$env:LocalAppData\Ociane\DocFx\"
  $docFxBinDir = "$env:LocalAppData\Ociane\DocFx\bin\"
  $exe = Get-ChildItem -Path $docFxBinDir -Filter *.exe
  if ($exe -eq $null) {
    Write-Host "DocFx NotFound, installing to $docFxDir"
    Download-Tool http://dev.ociane.fr:3690/svn/Dev/_/Tools/DocFx/deliverables/ $docFxDir
    $zipFile = Get-ChildItem "$docFxDir/*.zip" | Sort-Object $_.Name | Select-Object -Last 1
    Write-Host "Extract $zipFile to $docFxBinDir"
    Expand-Archive -Path $zipFile -DestinationPath $docFxBinDir -Force
    $exe = Get-ChildItem -Path $docFxBinDir -Filter *.exe
  }
  Write-Host "DocFx Found in : $($exe.FullName)"
  return $exe.FullName
}

function Download-Tool($svnRemotePath, $out)
{
  if (-not (Test-Path $out)) {
    & svn export $svnRemotePath $out
  }
}

Export-ModuleMember -Function Get-DocFx,Invoke-DocFxMetadata,Invoke-DocFxBuild,Invoke-DocFxServe
