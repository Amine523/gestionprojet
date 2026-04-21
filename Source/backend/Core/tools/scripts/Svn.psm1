function Invoke-SvnGetRemoteDir()
{
    $svn = Get-SvnExe
    $url = $(& "$svn" info --show-item=url)
    $index = $url.IndexOf('trunk')
    if ($index -lt 0) { $index = $url.IndexOf('branches') }
    if ($index -lt 0) { $index = $url.IndexOf('tags') }
    if ($index -lt 0) { return $url }
    return $url.SubString(0, $index)
}
Export-ModuleMember -Function Invoke-SvnGetRemoteDir

function Invoke-SvnUpdate()
{
    $svn = Get-SvnExe
    & "$svn" update
}
Export-ModuleMember -Function Invoke-SvnUpdate

function Invoke-SvnCheckout($RemoteRelativePath, $DestinationPath)
{
    $svn = Get-SvnExe
    $remoteDir = Invoke-SvnGetRemoteDir
    & "$svn" checkout "$remoteDir/$RemoteRelativePath" $DestinationPath
}
Export-ModuleMember -Function Invoke-SvnCheckout

function Invoke-SvnAdd($Filter)
{
    $svn = Get-SvnExe
    & "$svn" add "$Filter"
}
Export-ModuleMember -Function Invoke-SvnAdd

function Invoke-SvnCommit($Message, [Switch]$NoUpdate)
{
    $svn = Get-SvnExe
    if ($NoUpdate)
    {
        & "$svn" propset LOG_FOR_MESSAGE $(Get-Date) .
    }
    & "$svn" commit -m "$Message"
}
Export-ModuleMember -Function Invoke-SvnCommit

function Publish-SvnTag($TagName)
{
    $svn = Get-SvnExe
    $remoteRootDir = Invoke-SvnGetRemoteDir
    & "$svn" copy "." "$remoteRootDir/tags/$TagName" -m "Create tag v$env:MajorMinorPatch"
}
Export-ModuleMember -Function Publish-SvnTag

function Get-SvnExe() {
    return (Get-Command "svn").Path
}
