# functions ...
function ConvertFrom-Json20([object] $item){ 
    add-type -assembly system.web.extensions
    $ps_js=new-object system.web.script.serialization.javascriptSerializer
  
    #The comma operator is the array construction operator in PowerShell
    return ,$ps_js.DeserializeObject($item)
}

Export-ModuleMember -Function ConvertFrom-Json20

function ConvertTo-Json20([object] $item){
    add-type -assembly system.web.extensions
    $ps_js=new-object system.web.script.serialization.javascriptSerializer
    return $ps_js.Serialize($item)
}


Export-ModuleMember -Function ConvertTo-Json20

function Invoke-PatchPackageVersion($package,$versionInfo) {
    # Patch project file for version synchronisation
    # Get package file for version synchronisation
    $pack = Get-Content $package
    $packObj = ConvertFrom-Json20 $pack
    $packObj.version = $versionInfo
    $pack = ConvertTo-Json20 $packObj
    $pack | Out-File -FilePath $package -Encoding utf8
}
Export-ModuleMember -Function Invoke-PatchPackageVersion


function Invoke-GetPackageVersion($package) {
    # Get package file for version synchronisation
    $pack = Get-Content $package
    $packObj = ConvertFrom-Json20 $pack
    return $packObj.version
}
Export-ModuleMember -Function Invoke-GetPackageVersion