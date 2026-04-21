# Script pour le pipeline ociane-build-dotnet-api-template.yml
param (
	[Parameter(Mandatory=$true)]
    [string]$ProjectFilePath,
	[Parameter(Mandatory=$true)]
    [string]$OpenApiGeneratorExe,
	[Parameter(Mandatory=$false)]
    [string]$DestPath,
	[Parameter(Mandatory=$false)]
    [bool]$GitPush
)


# $THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
# $ToolsPath = $THIS_SCRIPTS_DIRECTORY_PATH

function Invoke-GenerateRestClient()
{
	$WebApiJsonPath = Get-WebApiPath 
	Write-Host "WebApi : " $WebApiJsonPath
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
	Write-Host " Push sources on Git    => "  $GitPush
	Write-Host ""
	
	if (!(Test-Path $WebApiJsonPath))
    {
      throw "[ERROR] File not found " + $WebApiJsonPath 
    }
	
	if ($RestClientName -eq "")
    {
      throw "[ERROR] RestClientName is empty. Check RootNameSpace in csproj file." 
    }
	
	$restClientDir = Invoke-GenerateClient $OpenApiGeneratorExe $RestClientDestPath $RestClientName $WebApiJsonPath $RestClientVersion $RestClientDestPath
	Write-Host "##vso[task.setvariable variable=NuGetFilePath]$restClientDir"
	Invoke-GitPush $restClientDir
}


function Invoke-GenerateClient($openApiExe, $out, $RestClientName, $WebApiJsonPath, $RestClientVersion, $RestClientDestPath)
{
    Write-Host "======================================================================================="
	Write-Host " Generating rest client sources files and NuGet" 
	Write-Host " =>"  $out
	Write-Host "======================================================================================="
	Write-Host "" 
	
	$process = Start-Process -FilePath $openApiExe  -NoNewWindow -PassThru -Wait -ArgumentList '--name', $RestClientName, '--openapi', $WebApiJsonPath, '--version', $RestClientVersion, '--output', $RestClientDestPath
	if($process.ExitCode -eq 0) 
	{
		return Resolve-Path $out
	}
	else
	{
		return ""
	}
}

function Get-WebApiPath
{
	# Récupere le webapi.json au meme niveau de le fichier csproj
	return join-path (split-path $ProjectFilePath) "webapi.json"
}

function Get-DestPath
{
	if([string]::IsNullOrEmpty($DestPath)) 
	{
		return join-path (split-path $ProjectFilePath) "../RestClient"
	}
	
	Remove-Item $DestPath -Recurse -ErrorAction Ignore
	
	return $DestPath
}

function Get-RestRestClientName
{
	$xml = [xml](Get-Content $ProjectFilePath)

    $RootNamespace = ([String] $xml.Project.PropertyGroup.RootNamespace).Trim()
	write-host "RootNamespace" $RootNamespace
	if(![string]::IsNullOrEmpty($RootNamespace))
	{
		  return $RootNamespace + ".RestClient"
	}
	
	# TODO parser le nom du csproj 
	return "";
}

function  Get-ProjectVersion 
{
    $xml = [xml](Get-Content $ProjectFilePath)
   
    $value = [String] $xml.Project.PropertyGroup.Version
    
    if([string]::IsNullOrEmpty($value))
	{
        return "1.0.0"
    }
	
    return $value 
}

function Invoke-GitPush($restClientDir)
{
	if($GitPush -eq $False)
	{
		return;
	}
	
	Write-Host "Pushing sources on Git"
	Set-Location $restClientDir
	git add . | Write-Host
	git commit -m "Mise a jour du code source automatique"  | Write-Host
	git merge --strategy-option ours
	git push | Write-Host
}
Invoke-GenerateRestClient

