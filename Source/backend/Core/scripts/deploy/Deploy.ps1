param 
(
    [Parameter(Mandatory=$true)]
    [ValidateSet('DEV','INT','HOM','PRO')]    
    [string]$Environment,
    [Parameter(Mandatory=$false)]
    [string]$ZipPathFileName,
    [Parameter(Mandatory=$false)]
    [string]$ZipPathName,
    [Parameter(Mandatory=$false)]
    [string]$ZipPrefixFileName	
)


$ApiName = $ZipPrefixFileName
$Version = "V1"

Switch ($Environment)
{
    "DEV" { $DirectorySites = Join-Path "D:\projet pfe\Sites" $ZipPrefixFileName }
    "INT" { $DirectorySites = Join-Path "E:\DEV\CliniPro\Sites" $ZipPrefixFileName }
	"HOM" { $DirectorySites = Join-Path "\\srvappservices\Sites" $ZipPrefixFileName }
    "PRO" { $DirectorySites = Join-Path "\\srvappservices\Sites" $ZipPrefixFileName }

    Default {  }
}

& "../../tools/scripts/DeployApi.ps1" -Environment $Environment -DirectorySites $DirectorySites -ApiName $ApiName -Version $Version -ZipPathFileName $ZipPathFileName -ZipPathName $ZipPathName  -ZipPrefixFileName $ZipPrefixFileName