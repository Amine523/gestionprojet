function Invoke-PatchNuspecVersion($nuspec,$versionInfo) {
    # Patch project file for version synchronisation
    $proj = [xml](Get-Content $nuspec)
    # test if version tag is present or not and if propertygroups exist for build or not
    $ver = $proj.SelectNodes("//version")
    if ($ver.Count -ge 1) {
        $ver.Item(0).InnerText = $versionInfo
        $proj.Save($nuspec)
        Write-Host("Nuspec file succesfuly patched to version " + $versionInfo)        
    } else {
        Write-Host("This nuspec misses the version tag, please add it")        
    }
}
Export-ModuleMember -Function Invoke-PatchNuspecVersion


function Invoke-GetNuspecVersion($nuspec) {
    # Patch project file for version synchronisation
    $proj = [xml](Get-Content $nuspec)
    # test if version tag is present or not and if propertygroups exist for build or not
    $ver = $proj.SelectNodes("//version")
    if ($ver.Count -ge 1) {
        return $ver.Item(0)."#text"
    } 
}
Export-ModuleMember -Function Invoke-GetNuspecVersion