function Compress-Archive
( 
    [Parameter(Mandatory=$true, Position=0)] [ValidateScript({Test-Path $_})] [string] $Path,
    [Parameter(Mandatory=$true, Position=1)] [ValidateNotNullOrEmpty()] [string] $DestinationPath,
    [Parameter(Mandatory=$false, Position=2)] [Switch] $Force = $false
)
{
    If ($Force -and (Test-Path -Path $DestinationPath))
    {
        Write-Debug "Remove $DestinationPath"
        Remove-Item -Path $DestinationPath
    }

    If (-Not (Test-Path "$DestinationPath"))
    {
        # create an empty zip file
        Write-Debug "Create empty fip file $DestinationPath"
        Set-Content -Path $DestinationPath -value ("PK" + [char]5 + [char]6 + ("$([char]0)" * 18)) -ErrorAction Stop
        $zipfile = $DestinationPath | Get-Item -ErrorAction Stop
        $zipfile.IsReadOnly = $false
        
        $shell = New-Object -Com Shell.Application
        $zipPackage = $shell.NameSpace($zipfile.fullname)
        foreach ($file in Get-Item -Path $Path)
        {
            $zipPackage.CopyHere($file.FullName, 4)
            Start-sleep -milliseconds 500
        }
    }
}

function Expand-Archive
( 
    [Parameter(Position = 0, Mandatory = $true)] [ValidateScript({Test-Path $_})] [string] $Path,
    [Parameter(Position = 1, Mandatory = $true)] [ValidateNotNullOrEmpty()] [string] $DestinationPath,
    [Parameter(Position = 2, Mandatory = $false)] [Switch] $Force = $false
)
{
    If ($Force -and (Test-Path -Path $DestinationPath))
    {
        Write-Debug "Remove $DestinationPath"
        Remove-Item -Path $DestinationPath -Recurse -Force
    }

    Write-Debug "Create directory $DestinationPath"
    $x = New-Item -ItemType Directory "$DestinationPath" 

    # No file inside `$DestinationPath`
    $shell = New-Object -Com Shell.Application
    Write-Debug "Copy $Path to $DestinationPath"
    $src = $shell.NameSpace($Path)
    $dst = $shell.NameSpace($DestinationPath)
    Write-Debug "Copy $src to $dst"
    $dst.CopyHere($src.Items(), 4)
}

If ($PSVersionTable.PSVersion.Major -lt 4) {
    Export-ModuleMember -Function Compress-Archive,Expand-Archive
}
