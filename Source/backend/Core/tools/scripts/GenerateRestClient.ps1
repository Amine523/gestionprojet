# Get Command Line Parameters
param (
	[Parameter(Mandatory=$true)]
    [string]$ProjectFilePath,
	[Parameter(Mandatory=$false)]
    [string]$WebApiJsonPath,
	[Parameter(Mandatory=$false)]
    [string]$DestPath,
	[Parameter(Mandatory=$false)]
    [string]$ApiName,
	[Parameter(Mandatory=$false)]
    [string]$Version
)


# $THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
# $ToolsPath = $THIS_SCRIPTS_DIRECTORY_PATH

function Invoke-GenerateRestClient()
{
	$WebApiJsonPath = Get-WebApiPath 
	$RestClientDestPath = Get-DestPath
	$RestClientName = Get-RestRestClientName
	$RestClientVersion = Get-ProjectVersion 
	
	Write-Host "======================================================================================="
	Write-Host " Project parameters " 
	Write-Host "======================================================================================="
	Write-Host ""
    Write-Host " Projet file path       => "  $ProjectFilePath
	Write-Host " WebApiJson file path   => "  $WebApiJsonPath
	Write-Host " RestClient destination => "  $RestClientDestPath 
	Write-Host " RestClient Name        => "  $RestClientName 
	Write-Host " RestClient Version     => "  $RestClientVersion 
	Write-Host ""
	
	if (!(Test-Path $WebApiJsonPath))
    {
      throw "[ERROR] File not found " + $WebApiJsonPath 
    }
	
  $tmp = [System.IO.Path]::GetRandomFileName()
  
  $openApiLocalDir =  "$env:LocalAppData\Ociane\OpenApiGenerator\"
  
  $openApiSources = Get-OpenApiGenerator-Sources $openApiLocalDir | Select-Object -Last 1
  
  $openApiExe = Get-OpenApiGenerator-Exe $openApiLocalDir $openApiSources | Select-Object -Last 1
  
  $restClientDir = Invoke-GenerateClient $openApiExe $RestClientDestPath $RestClientName $WebApiJsonPath $RestClientVersion $RestClientDestPath
  
  Invoke-item $restClientDir
}


function Get-OpenApiGenerator-Sources($openApiLocalDir)
{
    $out = [IO.Path]::Combine($openApiLocalDir, "git")
	Write-Host "======================================================================================="
	Write-Host " Downloading Ociane.Tools.Console.OpenApiGenerator From Azure Devops  " 
	Write-Host " =>" $out
	Write-Host "======================================================================================="
	Write-Host ""
	
	if (Test-Path -Path $out) {
		Remove-Item -Path $out -Recurse -Force
	}
	
	git clone https://devops.intra.ociane.fr/DefaultCollection/Ociane.Tools/_git/Ociane.Tools.OpenApiGenerator $out
    
	Write-Host ""
	
	#Remplacer par un Filter csproj ... 
	return [IO.Path]::Combine($out, 'src', 'Ociane.Tools.Console.OpenApiGenerator', 'Ociane.Tools.Console.OpenApiGenerator.csproj')
}

function Get-OpenApiGenerator-Exe($openApiLocalDir, $openApiSources)
{
	$out = [IO.Path]::Combine($openApiLocalDir, "bin")
	Write-Host "======================================================================================="
	Write-Host " Compiling Ociane.Tools.Console.OpenApiGenerator" 
	Write-Host " =>"  $out
	Write-Host "======================================================================================="
	Write-Host ""
	
	if (Test-Path -Path $out) {
		Remove-Item -Path $out -Recurse -Force
	}
	
	dotnet publish $openApiSources -c Release --nologo --output $out | Write-Host 
	
	Write-Host ""
	
    return [IO.Path]::Combine($out, 'Ociane.Tools.Console.OpenApiGenerator.exe')
}

function Invoke-GenerateClient($openApiExe, $out, $RestClientName, $WebApiJsonPath, $RestClientVersion, $RestClientDestPath)
{
    Write-Host "======================================================================================="
	Write-Host " Generating rest client sources files and NuGet" 
	Write-Host " =>"  $out
	Write-Host "======================================================================================="
	Write-Host "" 
	
	Start-Process -FilePath $openApiExe  -NoNewWindow -Wait -ArgumentList '--name', $RestClientName, '--openapi', $WebApiJsonPath, '--version', $RestClientVersion, '--output', $RestClientDestPath | Write-Host
	
	return $out;
}

function Get-WebApiPath
{
	if(![string]::IsNullOrEmpty($WebApiJsonPath)) 
	{
		return $WebApiJsonPath;
	}
	
	# Récupere le webapi.json au meme niveau de le fichier csproj
	return join-path (split-path $ProjectFilePath) "webapi.json"
	
}

function Get-DestPath
{
	if(![string]::IsNullOrEmpty($DestPath)) 
	{
		return $DestPath;
	}
	
	# Récupere le webapi.json au meme niveau de le fichier csproj
	return join-path (split-path $ProjectFilePath) "../RestClient"
}

function Get-RestRestClientName
{
	if(![string]::IsNullOrEmpty($ApiName)) 
	{
		return $ApiName + ".RestClient"
	}
	$xml = [xml](Get-Content $ProjectFilePath)

    $RootNamespace = [String] $xml.Project.PropertyGroup.RootNamespace

	if(![string]::IsNullOrEmpty($RootNamespace))
	{
		  return $RootNamespace.Trim() + ".RestClient"
	}
	
	# TODO parser le nom du csproj 
	return "RestClient";
}

function  Get-ProjectVersion 
{
	if(![string]::IsNullOrEmpty($version)) 
	{
		return $version;
	}
	
    $xml = [xml](Get-Content $ProjectFilePath)
   
    $value = [String] $xml.Project.PropertyGroup.Version
    
    if([string]::IsNullOrEmpty($value))
	{
        return "1.0.0"
    }
	
    return $value 
}

Invoke-GenerateRestClient

