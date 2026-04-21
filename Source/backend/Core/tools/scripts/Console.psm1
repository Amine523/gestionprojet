function Console-ShowTitle([string]$Title, [string]$LogFile)
{	
    $whitespaces = "                                                                                "
	$injection = [System.String]::Concat(" ", $Title, $whitespaces)
	$injection = $injection.Substring(0, 80)
	[System.Console]::Clear()
	"/**********************************************************************************/" |  Tee-Object -FilePath $LogFile -Append | Write-Host -ForegroundColor Blue 
	"/*$injection*/" | Tee-Object -FilePath $LogFile -Append | Write-Host -ForegroundColor Blue
	"/**********************************************************************************/" | Tee-Object -FilePath $LogFile -Append | Write-Host -ForegroundColor Blue
}

function Console-ShowInfos([string]$Infos, [string]$LogFile)
{	
	" ¤ $infos" | Tee-Object -FilePath $LogFile -Append | Write-Host -ForegroundColor DarkGray
}

function Console-ShowGoodNews([string]$GoodNews, [string]$LogFile)
{
	[System.Console]::Clear()
	$goodNews | Tee-Object -FilePath "D:\test.txt" -Append | Write-Host -ForegroundColor Green
	# write-host $goodNews -ForegroundColor Green
}

function Console-ShowError([string]$Message, [string]$Error, [string]$LogFile)
{
	"[Erreur] $message" | Tee-Object -FilePath "D:\test.txt" -Append | Write-Host -ForegroundColor Red
	$error | Tee-Object -FilePath "D:\test.txt" -Append | Write-Host -ForegroundColor Red
	# Write-Host "[Erreur] $message" -ForegroundColor Red
	# Write-Host $error  -ForegroundColor Red
}

# Specify which functions should be publicly accessible.
Export-ModuleMember -Function Console-ShowTitle
Export-ModuleMember -Function Console-ShowInfos
Export-ModuleMember -Function Console-ShowGoodNews
Export-ModuleMember -Function Console-ShowError