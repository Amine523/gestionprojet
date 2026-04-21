function Invoke-DeposerNuget
{
    param (
    [Parameter(Mandatory=$true)]
    $RestClientSourcePath)

    $CsProjFilePath = Get-CsProjFilePath $RestClientSourcePath

    Write-host "Packaging du NuGet a partir du csproj : " $CsProjFilePath

    dotnet pack $CsProjFilePath -c Release

    $NugetFilePath = Get-NuGetFilePath $CsProjFilePath

    Write-host "Push sur le dépot Ociane a partir du nukpg :  : " $NugetFilePath

    dotnet nuget push  $NugetFilePath --source "https://devops.intra.ociane.fr/DefaultCollection/_packaging/packages_ociane_framework/nuget/v3/index.json" --api-key AzureDevops --skip-duplicate
}

# TODO: A ameliorer 
function Get-CsProjFilePath($Directory)
{
    $CsProjFilePath = Get-ChildItem -Path $Directory -Filter *.csproj  -Recurse -ErrorAction SilentlyContinue -Force  | Select-Object -First 1

    return $CsProjFilePath.fullName
}

# TODO: A ameliorer 
function Get-NuGetFilePath($CsProjFilePath)
{
    $Directory = split-path $CsProjFilePath

    $NugetFilePath = Get-ChildItem -Path $Directory -Filter *.nupkg  -Recurse -ErrorAction SilentlyContinue -Force  | Select-Object -First 1

    return $NugetFilePath.fullName 
}