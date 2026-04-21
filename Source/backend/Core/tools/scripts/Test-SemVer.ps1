# Get Command Line Parameters
param (
)
	$resultCode = 0
	
	<###########################################################################>
	<#                       Chargement des dépendances                        #>
	<###########################################################################>
	$ToolsPath = Split-Path $script:MyInvocation.MyCommand.Path
	Import-Module $ToolsPath\SemVer.psm1	
	Invoke-SemVer($false)
	
	Write-Host "Major:" $env:Major
    Write-Host "Minor:" $env:Minor
	Write-Host "Patch:" $env:Patch
    Write-Host "Revision:" $env:Revision
    Write-Host "BranchName:" $env:BranchName
    Write-Host "CommitId:" $env:CommitId
    Write-Host "CommitDate:" $env:CommitDate
    Write-Host "PreRelease:" $env:PreRelease
    Write-Host "BuildInfo:" $env:BuildInfo
    Write-Host "MajorMinor:" $env:MajorMinor
    Write-Host "MajorMinorPatch:" $env:MajorMinorPatch
    Write-Host "MajorMinorPatchRevision:" $env:MajorMinorPatchRevision
    Write-Host "SemVer:" $env:SemVer
    Write-Host "FullSemVer:" $env:FullSemVer
    Write-Host "FileVersion:" $env:FileVersion
    Write-Host "AssemblyVersion:" $env:AssemblyVersion
    Write-Host "InformationalVersion:" $env:InformationalVersion
    Write-Host "PackageVersion:" $env:PackageVersion
	
	Exit $resultCode