function Invoke-GenerateSource
{
    param (
    [Parameter(Mandatory=$true)]
    $CsProjFilePath,
    [Parameter(Mandatory=$true)]
    $OpenApiGeneratorDirectoryPath,
    [Parameter(Mandatory=$true)]
    $RestClientPath)

    Write-host "Debut de la génération des source du client Rest"

    Write-Host "Chemin du fichier csproj utilisé :" $CsProjFilePath

    $WebApiFilePath = Get-WebApiPath $CsProjFilePath

    $RestClientPackageName = Get-RestClientPackageName $CsProjFilePath

    Write-host "Nom de package Rest Client a générer : " $RestClientPackageName
    
    $ProjectVersion = Get-ProjectVersion $CsProjFilePath

    Write-host "Version du package Rest Client a générer : " $ProjectVersion

    Invoke-GenerateRestClient $OpenApiGeneratorDirectoryPath $WebApiFilePath $RestClientPackageName $ProjectVersion.Trim() $RestClientPath "csharp-netcore"
}

function  Get-ProjectVersion($CsProjFilePath)
{
    Write-Host "Récupération de la version de l'API depuis le csproj :" $CsProjFilePath

    $xml = [xml](Get-Content $CsProjFilePath)
   
    $version = [String] $xml.Project.PropertyGroup.Version
    
    if("" -eq $Version)
    {
        Write-Host "Aucune version detectée dans le csproj"
        return "1.0.0"
    }

    return $version 
}

function Get-WebApiPath($CsProjFilePath)
{
    Write-Host "Récupération du fichier webapi.json"
     
    $WebApiFilePath = join-path (split-path $CsProjFilePath) "webapi.json"

    if (!(Test-Path $WebApiFilePath))
    {
      throw "[Erreur] Le fichier " + $WebApiFilePath + " n'existe pas"
    }

    Write-Host "Fichier webapi.json trouvé : "  $WebApiFilePath
    return $WebApiFilePath
}

function  Get-RestClientPackageName($CsProjFilePath)
{
    Write-Host "Récupération du namespace de l'API depuis le csproj :" $CsProjFilePath

    $xml = [xml](Get-Content $CsProjFilePath)

    $RootNamespace = [String] $xml.Project.PropertyGroup.RootNamespace

    Write-Host "Namespace : " $RootNamespace

    return $RootNamespace.Trim() + ".RestClient"
}

function  Get-ProjectVersion($CsProjFilePath)
{
    Write-Host "Récupération de la version de l'API depuis le csproj :" $CsProjFilePath

    $xml = [xml](Get-Content $CsProjFilePath)
   
    $version = [String] $xml.Project.PropertyGroup.Version
    
    if("" -eq $Version)
    {
        Write-Host "Aucune version detectée dans le csproj"
        return "1.0.0"
    }

    Write-Host "Version : " $Version

    return $version 
}

function Invoke-GenerateRestClient($OpenApiGeneratorDirectoryPath, $WebApiFilePath, $RestClientPackageName, $ProjectVersion, $RestClientPath, $Generator)
{
    Write-Host 'Génération du code source Rest Client dans le dossier temporaire : ' $RestClientPath

    $OpenApiGeneratorJarPath = join-path $OpenApiGeneratorDirectoryPath "bin/openapi-generator-cli-5.1.0.jar"
    $OpenApiGeneratorGeneratorPath = join-path $OpenApiGeneratorDirectoryPath $Generator
    $OpenApiGeneratorConfigurationDirectoryPath = join-path $OpenApiGeneratorGeneratorPath "conf/restclient-config.json"
    $OpenApiGeneratorTemplateDirectoryPath = join-path $OpenApiGeneratorGeneratorPath "templates"
    
    Write-Host "Variable JAVA_HOME :" $env:JAVA_HOME
    $JAVA_LOC = $env:JAVA_HOME
    if ($JAVA_LOC -eq '' -or $JAVA_LOC -eq $null ) {
        $JAVA_LOC = 'java.exe'
    } else {
        $JAVA_LOC = $JAVA_LOC + '\bin\java.exe'
    }
    Write-Host "Variable JAVA_LOC :" $JAVA_LOC
   
    # .$env:JAVA_HOME\bin\java 
    .$JAVA_LOC -jar $OpenApiGeneratorJarPath generate -i $WebApiFilePath -g $Generator -o $RestClientPath -c $OpenApiGeneratorConfigurationDirectoryPath  -t $OpenApiGeneratorTemplateDirectoryPath --additional-properties=packageName=$RestClientPackageName,npmName=$RestClientPackageName,packageVersion=$ProjectVersion,npmVersion=$ProjectVersion --remove-operation-id-prefix --type-mappings=DateTime=Date

   # return join-path (join-path $RestClientPath 'src') $RestClientPackageName
}

function Invoke-GenerateServer($OpenApiGeneratorDirectoryPath, $WebApiFilePath, $WebApiPackageName, $ProjectVersion, $WebApiPath, $Generator)
{
    Write-Host 'Génération du code source Serveur API dans le dossier temporaire : ' $WebApiPath

    $OpenApiGeneratorJarPath = join-path $OpenApiGeneratorDirectoryPath "bin/openapi-generator-cli-5.1.0.jar"
    $OpenApiGeneratorGeneratorPath = join-path $OpenApiGeneratorDirectoryPath $Generator
    $OpenApiGeneratorConfigurationDirectoryPath = join-path $OpenApiGeneratorGeneratorPath "conf/webapi-config.json"
    $OpenApiGeneratorTemplateDirectoryPath = join-path $OpenApiGeneratorGeneratorPath "templates"
    
    Write-Host "Variable JAVA_HOME :" $env:JAVA_HOME
    $JAVA_LOC = $env:JAVA_HOME
    if ($JAVA_LOC -eq '' -or $JAVA_LOC -eq $null ) {
        $JAVA_LOC = 'java.exe'
    } else {
        $JAVA_LOC = $JAVA_LOC + '\bin\java.exe'
    }
    Write-Host "Variable JAVA_LOC :" $JAVA_LOC
   
    # .$env:JAVA_HOME\bin\java 
    .$JAVA_LOC -jar $OpenApiGeneratorJarPath generate -i $WebApiFilePath -g $Generator -o $WebApiPath -c $OpenApiGeneratorConfigurationDirectoryPath  -t $OpenApiGeneratorTemplateDirectoryPath --additional-properties packageName=$WebApiPackageName,packageVersion=$ProjectVersion --remove-operation-id-prefix --type-mappings=DateTime=Date

   # return join-path (join-path $RestClientPath 'src') $RestClientPackageName
}

Export-ModuleMember -Function *