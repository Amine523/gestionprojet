$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Import-Module $ScriptDir/Archive.psm1

function Invoke-Badger
( 
  [Parameter(Position = 0, Mandatory = $true)] [string] $Label,
  [Parameter(Position = 1, Mandatory = $true, ValueFromPipeline = $true)] [string] $Text,
  [Parameter(Position = 2, Mandatory = $true)] [string] $DestinationPath,
  [Parameter(Position = 3, Mandatory = $false)] $Value = $null
)
{
  $DestinationPath = "$DestinationPath\$Label.svg"
  If ($Value -eq $null) { $Value = $Text }

  $exe = Get-Badger
  
  If ($value -is [string] -and $value -eq 'passed') { $color = '#4c1' }
  ElseIf (-not ($value -is [string]) -and $value -eq 100) { $color = '#4c1' }
  ElseIf (-not ($value -is [string]) -and $value -ge 80) { $color = '#97ca00' }
  ElseIf (-not ($value -is [string]) -and $value -ge 60) { $color = '#dfb317' }
  Else { $color = '#e05d44' }

  Write-Debug "Create $DestinationPath with color '$color'"
  & "$exe" -label $label -value $text -color $color -output $DestinationPath
}

function Get-Badger()
{
  $badgerDir = "$env:LocalAppData\Ociane\Badger"
  $badgerBinDir = "$env:LocalAppData\Ociane\Badger\bin"
  Download-Tool http://dev.ociane.fr:3690/svn/Dev/_/Tools/Badger/deliverables/ $badgerDir
  $zipFile = Get-ChildItem "$badgerDir\*.zip" | Sort-Object $_.Name | Select-Object -Last 1
  Write-Debug "Extract $zipFile to $badgerBinDir"
  Expand-Archive -Path $zipFile -DestinationPath $badgerBinDir -Force
  $exe = Get-ChildItem -Path $badgerBinDir -Filter *.exe
  Write-Debug "Found: $($exe.FullName)"
  return $exe.FullName
}

function Download-Tool($svnRemotePath, $out) {
  if (-not (Test-Path $out)) {
    & svn export $svnRemotePath $out
  }
}

Export-ModuleMember -Function Get-Badger,Invoke-Badger
