param 
(
    [Parameter(Mandatory=$false)]
    [ValidateSet('DEV','INT','HOM','PRO')]
    [string]$Environment,
    [Parameter(Mandatory=$true)]
    [string]$DirectorySites,
    [Parameter(Mandatory=$false)]
    [string]$AppName,
    [Parameter(Mandatory=$false)]
    [string]$MainDll,
    [Parameter(Mandatory=$false)]
    [string]$Version,
    [Parameter(Mandatory=$false)]
    [string]$ZipPathFileName,
    [Parameter(Mandatory=$false)]
    [string]$ZipPathName,
    [Parameter(Mandatory=$false)]
    [string]$ZipPrefixFileName
    
)
#Write-Host ("$ZipPathFileName $Environment $DirectorySites $AppName $Version") -ForegroundColor Magenta
Clear-Host

if ($Environment -ne "PRO") {
	$DirectorySites = "\\serv20exploittest.ociane.fr\exploitation$\" + $Environment
}
else {
	$DirectorySites = "\\serv20exploit.ociane.fr\exploitation$\"
}

Write-Host ("$Environment $DirectorySites $AppName $MainDll $Version $ZipPathFileName $ZipPathName $ZipPrefixFileName") -ForegroundColor Magenta


try 
{
    <###########################################################################>
    <#                 Vérification des paramètres en entrée                   #>
    <#                  Soit le fichier avec son chemin complet est fourni     #>
    <#                  Soit le répertoire avec le prefixe du nom du fichier   #>
    <###########################################################################>          
    if($ZipPathFileName)
    {
        If (!(Test-Path $ZipPathFileName)) { throw  "[error] - ce fichier n'existe pas : " + $ZipPathFileName }
    }
    elseif($ZipPathName -and $ZipPrefixFileName)
    {
        If (!(Test-Path $ZipPathName)) { throw  "[error] - ce répertoire n'existe pas : " + $ZipPathName }
        $ZipPrefixFileName=$ZipPrefixFileName +"*" 
        $file = Get-ChildItem -Path $ZipPathName -Filter $ZipPrefixFileName | Sort-Object LastWriteTime -Descending | Select-Object -First 1 FullName 
        
        if($file) 
        {
            $ZipPathFileName=$file.FullName
        }
        else
        {
            throw  "[error] - aucun fichier trouvé dans ce répertoire : " + $ZipPathName + " avec ce prefixe de nom de fichier : " + $ZipPrefixFileName
        }
                           
        If (!(Test-Path $ZipPathFileName)) { throw  "[error] - ce fichier n'existe pas : " + $ZipPathFileName }
    }
    else
    {
        throw  "[error] - Soit vous renseignez le paramètre ZipPathFileName (fichier spécifique) ou les paramétres ZipPathName + ZipPrefixFileName (récupération du dernier fichier en date à travers un répertoire et un prefixe de nom de fichier) "
    }

    

    Write-Host
    Write-Host '<#########################################################>'
    Write-Host "<#           Déploiement du l'application Win$AppName$Environment$Version      #>"
    Write-Host '<#########################################################>'
    Write-Host
    <###########################################################################>
    <#                          CREATION DES VARIABLES                         #>
    <###########################################################################>
    [bool] $SuccesDeploiement = $False

    <#FOLDERS#>
    $THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
    #Write-Host 'THIS_SCRIPTS_DIRECTORY_PATH : '$THIS_SCRIPTS_DIRECTORY_PATH
    $RacinePath = (get-item $THIS_SCRIPTS_DIRECTORY_PATH ).parent.parent.FullName
    #Write-Host 'RacinePath : '$RacinePath
    $ToolsPath = Join-Path $RacinePath -ChildPath 'Tools/Scripts'
    #Write-Host 'ToolsPath : '$ToolsPath

    <#FILES#>
    $SynchronousZipAndUnzipModulePath = Join-Path $ToolsPath -ChildPath 'Synchronous-ZipAndUnzip.psm1'
    #Write-Host 'SynchronousZipAndUnzipModulePath : '$SynchronousZipAndUnzipModulePath
    $EnvironmentConvertModulePath = Join-Path $ToolsPath -ChildPath 'EnvironmentConvert.psm1'
    #Write-Host 'EnvironmentConvertModulePath : '$EnvironmentConvert

	$AppDirectory = Join-Path $DirectorySites -ChildPath ("Win{0}" -f $AppName)
	
	if ($Environment -ne "PRO") {
		$ApiVersionDirectory = Join-Path $DirectorySites -ChildPath ("Win{0}" -f $AppName)
	}
	else {
		$ApiVersionDirectory = Join-Path $DirectorySites -ChildPath ("Win{0}" -f $AppName)
	}
	

    <###########################################################################>
    <#                 SUPPRESSION DU App.CONFIG du App.config                 #>
    <#                  POUR LE RECYCLAGE DU POOL APPLICATIF                   #>
    <###########################################################################>

    $WebConfigPath = Join-Path $ApiVersionDirectory -ChildPath "Ociane.Services.Win$AppName.Core.dll.config"
	
	
	Write-Host "ConfigAppFilePath  $WebConfigPath" -ForegroundColor Yellow
    If (Test-Path $WebConfigPath)
    { 
        try {
            remove-item -path $WebConfigPath -Force 
            Write-Host ("[OK] - Suppression du Ociane.Services.$AppName.Core.dll.config") -ForegroundColor Green
            
            #Attente de 3 secondes 
            Start-Sleep -Seconds 3 -Verbose
        }
        catch {
            throw  "[error] - Suppression du Ociane.Services.$AppName.Core.dll.config - $_"
        }
    } 
    Else { Write-Warning "Avertissement : Le fichier $WebConfigPath n'existe pas" }



    <###########################################################################>
    <#              SUPPRESSION DES FICHIERS ET SS-REPERTOIRE                  #>
    <#                      DU REPERTOIRE APPLICATIF                           #>
    <###########################################################################>
    Write-Host ('Suppression des Fichiers et des Sous-Répertoires dans :  {0}' -f $ApiVersionDirectory) -ForegroundColor Gray;

    try {
		if (Test-Path -Path "$ApiVersionDirectory\*") {
			Get-ChildItem -Path $ApiVersionDirectory -Include * | Remove-Item -Recurse -Force -ErrorAction Stop
			Write-Host ('[OK] - Suppression des Fichiers et des Sous-Répertoires') -ForegroundColor Green

			#Attente de 3 secondes 
			Start-Sleep -Seconds 1 -Verbose
		} 
    }
    catch {
        $SuccesDeploiement = $False
        throw  "[error] - Suppression des Fichiers et des Sous-Répertoires - $_"
    }


    <###########################################################################>
    <#         DECOMPRESSION DE L'ARCHIVE DANS LE REPERTOIRE APPLICATIF        #>
    <#                    DANS LE REPERTOIRE APPLICATIF                        #>
    <###########################################################################>
    Write-Host ("Décompression de l'archive :  {0}" -f $ZipPathFileName) -ForegroundColor Gray

    try {
        If (!(Test-Path $ZipPathFileName)){ Throw "L'archive $ZipPathFileName n'existe pas" }

        # Import the Synchronous-ZipAndUnzip module.
        If (!(Test-Path $SynchronousZipAndUnzipModulePath)){ Throw "Le module $ZipPathFileName n'existe pas" }
        
        Import-Module -Name $SynchronousZipAndUnzipModulePath
        Expand-ZipFile -ZipFilePath $ZipPathFileName -DestinationDirectoryPath $ApiVersionDirectory -OverwriteWithoutPrompting
       
        Write-Host ('[OK] - Décompression de l''archive') -ForegroundColor Green  
    }
    catch {
        throw  "[error] -  Décompression de l''archive' - $_"
    }



    <###########################################################################>
    <#                    DEPLACEMENT DES FICHIERS DECOMPRESSES                #>
    <#                        DANS LE REPERTOIRE APPLICATIF                    #>
    <###########################################################################>
    $DirectoryBin = Join-Path $ApiVersionDirectory -ChildPath 'bin'
    Write-Host ('Déplacement des Fichiers de {0} vers {1} ' -f $DirectoryBin, $ApiVersionDirectory) -ForegroundColor Gray

    try{
        Move-Item -Path $DirectoryBin'\*' -Destination $ApiVersionDirectory

        #Suppression du dossier bin
        #Write-Host ('Suppression du dossier {0}' -f $DirectoryBin) -ForegroundColor White
        Remove-item $DirectoryBin -Force

        Write-Host ('[OK] - Déplacement des Fichiers') -ForegroundColor Green    
    }
    catch {
        throw  "[error] -  Décompression des Fichiers' - $_"
    } 
    

    <###########################################################################>
    <#                   SUPPRESSION DES APPSETTINGS INUTILES                  #>
    <#               (QUI NE CORRESPONDENT PAS A L'ENVIRONNEMENT)              #>
    <###########################################################################>
    Write-Host ('Suppression des AppSettings Hors Environnement') -ForegroundColor Gray


    try {
        # Import the Synchronous-EnvironmentConvertModulePath module.
        If (!(Test-Path $EnvironmentConvertModulePath)){ Throw "Le module $EnvironmentConvertModulePath n'existe pas" }
        Import-Module -Name $EnvironmentConvertModulePath

        # Recherche du libelle complet de l'environnements pour le code demandé (DEV,INT,RCT,PRO)
        [String]$EnvironmentString = EnvironmentToString($Environment)
        Remove-item $ApiVersionDirectory'\appsettings.*.json' -exclude *.$EnvironmentString.json -Force


        <###########################################################################>
        <#                       VERIFICAION DES L'APPSETTINGS                     #>
        <#                     (CORRESPONDANT A L'ENVIRONNEMENT)                   #>
        <###########################################################################>
        If (!(Test-Path "$ApiVersionDirectory\appsettings.$EnvironmentString.json")) { 
            Throw "Le Fichier $ApiVersionDirectory\appsettings.$EnvironmentString.json n'est pas présent"
        }
        If (!(Test-Path "$ApiVersionDirectory\appsettings.json")) { 
            Throw "Le Fichier $ApiVersionDirectory'\appsettings.json' n'est pas présent"
        }
        
        Write-Host ('[OK] - Suppression des AppSettings Hors Environnement') -ForegroundColor Green
        
    }
    catch {
        throw  "[error] -  Suppression des AppSettings' - $_"
    } 

	<###########################################################################>
    <#                   SUPPRESSION DES App.CONFIG INUTILES                   #>
    <#               (QUI NE CORRESPONDENT PAS A L'ENVIRONNEMENT)              #>
    <###########################################################################>
    Write-Host ("Suppression des Ociane.Services.Win$AppName.Core.dll.config Hors Environnement") -ForegroundColor Gray
	
	try {
		[String]$EnvironmentString = EnvironmentToString($Environment)
		
		# Si il existe un App.[Environnement].config => Suppression des autres et renommage en Ociane.Services.' + $AppName + '.Core.dll.config
		 If ((Test-Path "$ApiVersionDirectory\App.$EnvironmentString.config")) { 
		   Remove-item $ApiVersionDirectory"\Ociane.Services.Win$AppName.Core.dll.config" 
           Remove-item $ApiVersionDirectory"\App.*.config" -exclude *.$EnvironmentString.config -Force
		   Move-Item -Path "$ApiVersionDirectory\App.$EnvironmentString.config" -Destination $ApiVersionDirectory"\Ociane.Services.Win$AppName.Core.dll.config"
        }
	}
	catch {
		throw "[error] - Suppression des Ociane.Services.$AppName.Core.dll.config'  - $_"
	}

    <###########################################################################>
    <#                             MAJ DU App.CONFIG                           #>
    <#                          (SETTER L'ENVIRONNEMENT)                       #>
    <###########################################################################>
    Write-Host ("Mise à jour du Ociane.Services.Win$AppName.Core.dll.config") -ForegroundColor Gray
	Write-Host ($EnvironmentString ) -ForegroundColor Magenta
    try {
        $xml = [xml]'<?xml version="1.0" encoding="utf-8" ?>
					<configuration>
						<appSettings>
							<add key="ASPNETCORE_ENVIRONMENT" value="$EnvironmentString"/>
						</appSettings>
					</configuration>'
		$xml.SelectSingleNode("/configuration/appSettings/add[@key='ASPNETCORE_ENVIRONMENT']").value = $EnvironmentString
		
        $xml.Save($webConfigPath)
		
		# initialize the xml object
		$appConfig = New-Object XML
		# load the config file as an xml object
		$appConfig.Load($webConfigPath)
		
		if ($appConfig.SelectSingleNode("/configuration/appSettings/add[@key='ASPNETCORE_ENVIRONMENT']").value -eq $EnvironmentString) { Write-Host ("[OK] - Mise à jour du Ociane.Services.Win$AppName.Core.dll.config") -ForegroundColor Green }
        else { Write-Host ("[error] - Mise à jour du Ociane.Services.Win$AppName.Core.dll.config") -ForegroundColor Red; $SuccesDeploiement=$False }
		
		
    }
    catch {
        throw  "[error] -  Décompression des Fichiers' - $_"
    }
    
    $SuccesDeploiement = $True
}
catch {
    Write-Host $_ 
}

<###########################################################################>
<#                       AFFICHAGE RESULTAT FINAL                          #>
<###########################################################################>
if ($SuccesDeploiement) { Write-Host "[SUCCES] - Déploiement terminé" -ForegroundColor White -BackgroundColor DarkGreen; Exit 0 }
else { Write-Host "[ERROR] - Déploiement terminé" -ForegroundColor White -BackgroundColor Red; Exit 1 }



