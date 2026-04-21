$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Import-Module $ScriptDir/Archive.psm1

function Invoke-DbPublish
(
    [Parameter(Position = 0, Mandatory = $true)] [string] $ConnectionString,
    [Parameter(Position = 0, Mandatory = $true)] [string] $ScriptPath
)
{
    $exe = Get-DbPublish 
    & $exe -connectionString $ConnectionString -scriptPath $ScriptPath
}

function Get-DbPublish()
{
  $dbpubDir = "$env:LocalAppData\Ociane\DbPublish"
  $dbpubBinDir = "$env:LocalAppData\Ociane\DbPublish\bin"
  Download-Tool http://dev.ociane.fr:3690/svn/Dev/_/Tools/DbPublish/deliverables/ $dbpubDir
  $zipFile = Get-ChildItem "$dbpubDir\*.zip" | Sort-Object $_.Name | Select-Object -Last 1
  Write-Debug "Extract $zipFile to $dbpubBinDir"
  Expand-Archive -Path $zipFile -DestinationPath $dbpubBinDir -Force
  $exe = Get-ChildItem -Path $dbpubBinDir -Filter *.exe
  Write-Debug "Found: $($exe.FullName)"
  return $exe.FullName
}

function Download-Tool($svnRemotePath, $out) {
  if (-not (Test-Path $out)) {
    & svn export $svnRemotePath $out
  }
}

Export-ModuleMember -Function Get-DbPublish,Invoke-DbPublish
