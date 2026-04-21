function Invoke-GetSimpleName($fullpath) {
    $parts = $fullpath.Split("\")
    $file = $parts[$parts.count-1] 
    $fileparts = $file.Split(".")
    $partcount=$fileparts.count-2
    $filenameparts = $fileparts[0..$partcount] 
    $clean = $filenameparts -Join "."
    return $clean
}
Export-ModuleMember -Function Invoke-GetSimpleName
