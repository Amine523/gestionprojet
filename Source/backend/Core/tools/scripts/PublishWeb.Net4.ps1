# Get Command Line Parameters
param (
    [Parameter(Mandatory=$true)]
    [string]$AppName, 
    [Parameter(Mandatory=$true)]
    [string]$DestPath,
	[Parameter(Mandatory=$true)]
	[ValidateSet('Developpement','Integration','Homologation','Production','WCF-Developpement', 'WCF-Integration', 'WCF-Homologation', 'WCF-Production','API-Developpement', 'API-Integration', 'API-Homologation', 'API-Production')]
    [string]$EnvironmentName = 'Developpement'
)
	$resultCode = 0
	
	try
	{	
		<###########################################################################>
		<#                       Chargement des dépendances                        #>
		<###########################################################################>
		$ToolsPath = Split-Path $script:MyInvocation.MyCommand.Path
				
		Import-Module $ToolsPath\Console.psm1
		Import-Module $ToolsPath\SemVer.psm1
		Import-Module $ToolsPath\DotNetCore.psm1
		Import-Module $ToolsPath\Synchronous-ZipAndUnzip.psm1		
		
		$RandomDirectory = [System.IO.Path]::GetRandomFileName() + '/'
		$TmpPath = Join-Path "C:\Temp\Dev\PublishWeb.Net4\" $RandomDirectory
		If(!(Test-Path $TmpPath)){
			New-Item -ItemType Directory -Force -Path $TmpPath | Out-Null
		}
		
		$now = (Get-Date).toString("yyyyMMdd-HHmmss")
		$LogFileName = "PublishWeb.Net4.logs"
		$LogFilePath = Join-Path $TmpPath $LogFileName
		If(!(Test-Path $LogFilePath)){
			New-Item -ItemType File -Force -Path $LogFilePath | Out-Null
		}

		<###########################################################################>
		<#                       Calcul de la version                              #>
		<###########################################################################>
		Console-ShowTitle -Title "Détermination de la version..." -LogFile $LogFilePath

		$confirm = $EnvironmentName.replace("WCF-", "").replace("API-", "") -eq 'Production'
		Invoke-SemVer($confirm)

		$MajorMinorPatch = $env:MajorMinorPatch
		$Version = $env:SemVer
		$PackageVersion = $env:FullSemVer
		Console-ShowInfos -Infos "Version prise en compte : $Version" -LogFile $LogFilePath

		If($confirm -eq $false) 
		{
			$Version = $env:MajorMinorPatchRevision + $env:PreRelease + '-rc'
			$PackageVersion = $Version + $env:BuildInfo + '(' + $env:USERNAME + ')'
		}

		<###########################################################################>
		<#                       Affectation d'une version                         #>
		<###########################################################################>
		Console-ShowTitle -Title 'Diffusion des versions...' -LogFile $LogFilePath

		$Copyright = 'Copyright © ' + (Get-Date).ToString("yyyy")
		
		Console-ShowInfos -Infos "AssemblyVersion: $MajorMinorPatch" -LogFile $LogFilePath
		Console-ShowInfos -Infos "AssemblyFileVersion: $PackageVersion" -LogFile $LogFilePath
		(Get-ChildItem -recurse -File -Include "AssemblyInfo.vb", "AssemblyInfo.cs").Fullname
		
		Get-ChildItem -recurse -File -Include "AssemblyInfo.vb" | ForEach-Object { (Get-Content $_) -replace '(?<=<Assembly: AssemblyCompany\(")[^"]*', 'Ociane Groupe Matmut' | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.vb" | ForEach-Object { (Get-Content $_) -replace '(?<=<Assembly: AssemblyCopyright\(")[^"]*', $Copyright | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.vb" | ForEach-Object { (Get-Content $_) -replace '(?<=<Assembly: AssemblyVersion\(")[^"]*', $MajorMinorPatch | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.vb" | ForEach-Object { (Get-Content $_) -replace '(?<=<Assembly: AssemblyFileVersion\(")[^"]*', $PackageVersion | Set-Content $_ }

		Get-ChildItem -recurse -File -Include "AssemblyInfo.cs" | ForEach-Object { (Get-Content $_) -replace '(?<=\[assembly: AssemblyCompany\(")[^"]*', 'Ociane Groupe Matmut' | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.cs" | ForEach-Object { (Get-Content $_) -replace '(?<=\[assembly: AssemblyCopyright\(")[^"]*', $Copyright | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.cs" | ForEach-Object { (Get-Content $_) -replace '(?<=\[assembly: AssemblyVersion\(")[^"]*', $MajorMinorPatch | Set-Content $_ }
		Get-ChildItem -recurse -File -Include "AssemblyInfo.cs" | ForEach-Object { (Get-Content $_) -replace '(?<=\[assembly: AssemblyFileVersion\(")[^"]*', $PackageVersion | Set-Content $_ }

		<###########################################################################>
		<#                       Build du projet                                   #>
		<###########################################################################>
		Console-ShowTitle -Title 'Build en cours...' -LogFile $LogFilePath
		
		Console-ShowInfos -Infos "Dossier temporaire de build : $TmpPath" -LogFile $LogFilePath
		$BinTmpPath = Join-Path $TmpPath "bin"

		Invoke-Expression  "& `"C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional\MSBuild\Current\Bin\MSBuild.exe`"  -p:Configuration=$EnvironmentName -p:WebPublishMethod=FileSystem -p:PublishUrl=$BinTmpPath -p:DeleteExistingFiles=True -p:DeployOnBuild=true -p:DeployDefaultTarget=WebPublish -verbosity:Quiet" 
		if ($LastExitCode -ne 0) { throw "La build a échouée" }

		<###########################################################################>
		<#                       Packaging de binaires                             #>
		<###########################################################################>
		Console-ShowTitle -Title "Packaging en cours..." -LogFile $LogFilePath

		$EnvironmentNameTriGramme = $EnvironmentName.replace("WCF-", "").replace("API-", "").substring(0, 3).ToLower()

		$ZipFileName = $AppName + '-' + $Version + '-' + $EnvironmentNameTriGramme + '.zip'
		Console-ShowInfos -Infos "Nom du package : $ZipFileName" -LogFile $LogFilePath

		$DestPath = Join-Path $DestPath $AppName 
		Console-ShowInfos -Infos "Dossier de destination : $DestPath" -LogFile $LogFilePath

		If(!(Test-Path $DestPath)){
			New-Item -ItemType Directory -Force -Path $DestPath | Out-Null
		}

		$ZippingPath = Join-Path $TmpPath $ZipFileName
		$ZippingDestination = Join-Path $DestPath $ZipFileName

		Console-ShowInfos -Infos "Constitution du zip dans le dossier de temporaire" -LogFile $LogFilePath
		Get-ChildItem $BinTmpPath | ForEach-Object { Compress-ZipFile -ZipFilePath $ZippingPath -FileOrDirectoryPathToAddToZipFile $_.Fullname -OverwriteWithoutPrompting  }

		If((Test-Path $ZippingDestination -PathType leaf)){
			Console-ShowInfos -Infos "Suppression de l'ancien package" -LogFile $LogFilePath
			Remove-Item $ZippingDestination -Force
		}

		Console-ShowInfos -Infos "Déplacement du zip dans le dossier de destination (soyez patient...)" -LogFile $LogFilePath
		Move-Item -Path $ZippingPath -Destination $ZippingDestination -Force
		
		<###########################################################################>
		<#                       Packaging de binaires                             #>
		<###########################################################################>
		Console-ShowTitle -Title "Packaging en cours..." -LogFile $LogFilePath
		
		$FichierInstall = 'Deploy-' + $AppName + '-' + $Version + '-' + $EnvironmentNameTriGramme + '.ps1'
		$FichierInstallPath = Join-Path $DestPath $FichierInstall
		Get-Content $ToolsPath\Console.psm1, $ToolsPath\Synchronous-ZipAndUnzip.psm1, $ToolsPath\DeployWeb.Net4.template.ps1 | Set-Content $FichierInstallPath
		
		$Affectation = 'ZipPathFileName = "./' + $ZipFileName + '"'
		Get-ChildItem $FichierInstallPath -File  | ForEach-Object { (Get-Content $_) -replace 'ZipPathFileName = ""', $Affectation | Set-Content $_ }
		Get-ChildItem $FichierInstallPath -File  | ForEach-Object { (Get-Content $_) -replace 'Export-ModuleMembe', '#Export-ModuleMembe' | Set-Content $_ }

		Console-ShowGoodNews -GoodNews "Fin du script avec succès !" -LogFile $LogFilePath
	}
	catch {
		Console-ShowError -Message '[Erreur] La publication du projet a été interrompu pour les raisons suivantes : ' -Error $_ -LogFile $LogFilePath
		$resultCode = 1
		Read-Host "T'as vu ça ?"
	}
	finally {
		
		If((Test-Path $TmpPath)){
			Console-ShowInfos -Infos "Suppression du dossier temporaire" -LogFile $LogFilePath
			
			If((Test-Path $LogFilePath)){				
				$LoggingDestination = Join-Path $DestPath $ZipFileName
				$LoggingDestination = $LoggingDestination.Replace(".zip", ".logs")
				Move-Item -Path $LogFilePath -Destination $LoggingDestination -Force
			}
			
			Remove-Item $TmpPath -Recurse
		}
	}

	Exit $resultCode