function Invoke-DotnetRestore($project, [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    $project = (Resolve-Path "$project").Path
    & $dotnet restore $project $args
}
Export-ModuleMember -Function Invoke-DotnetRestore

function Invoke-DotnetBuild($project, [Alias("c")] $configuration="Debug", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    $project = (Resolve-Path "$project").Path
    Write-Debug "$dotnet build $project --nologo -c $configuration $args"
    & $dotnet build $project --nologo -c $configuration $args
    $env:_BuildStatus = $(If ($?) { 'passed' } else { 'failed' })
}
Export-ModuleMember -Function Invoke-DotnetBuild

function Invoke-DotnetTest($project, [Alias("c")] $configuration="Debug", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    $project = (Resolve-Path "$project").Path
    & $dotnet test $project --nologo -c $configuration -o $outDir $args | Tee-Object -Variable output

    Try { $total = ($output | Select-String -Pattern "\b(Nombre total de tests|Total tests).*:\s*([0-9]+)").Matches.Groups[1].Value } Catch { $total = 0 }
    Try { $passed = ($output | Select-String -Pattern "(R.ussi\(s\)|Passed).*:\s*([0-9]+)").Matches.Groups[1].Value } Catch { $passed = 0 }
    Try { $failed = ($output | Select-String -Pattern "(Non r.ussi\(s\)|Failed).*:\s*([0-9]+)").Matches.Groups[1].Value } Catch { $failed = 0 }

    $env:_TestPassed = $passed
    $env:_TestFailed = $failed
    $env:_TestPercent = $([int](10000 * [float]($passed / $total)) / 100)
   
    $CodeCoveragePath = ($output | Select-String -Pattern "^.*cobertura\.xml$").ToString().Trim()
    $env:_CodeCoverage = $([int](10000 * [float](Select-Xml -Path $CodeCoveragePath -XPath "//coverage/@line-rate").Node.Value) / 100)
}
Export-ModuleMember -Function Invoke-DotnetTest

function Invoke-DotnetPublish($project, [Alias("c")] $configuration="Release", [Alias("o")] $outDir, [Alias("v")] $versionPrefix="", [Alias("e")] $buildenv="Development", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    # patch version if necessary
    if ($versionPrefix -ne "") {
        Invoke-PatchProjectVersion $project $versionPrefix
    }
    $project = (Resolve-Path "$project").Path
    Write-Debug "$dotnet publish $project -o $outDir --nologo -c $configuration /p:EnvironmentName=$buildenv $args -r win-x64 --self-contained false"
    & $dotnet publish $project -o $outDir --nologo -c $configuration /p:EnvironmentName=$buildenv $args -r win-x64 --self-contained false
}
Export-ModuleMember -Function Invoke-DotnetPublish


function Invoke-TryDotnetPublish($project, [Alias("c")] $configuration="Release", [Alias("o")] $outDir, [Alias("v")] $versionPrefix="", [Alias("e")] $buildenv="Development", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    Invoke-DotnetPublish $project -c $configuration -o $outDir -v $versionPrefix -e $buildenv $args
    If ($LastExitCode -ne 0) {
        ####### Something went wrong, exit
        # cleanup first
        Remove-Item -Path $tmp -Recurse -Force
        Write-Host 'Error at dotnet publish' -fore red
        $answer = Read-Host -Prompt "Build unsuccessful, type y and return to retry, or just return to exit"
        if ($answer -ne 'y') {
            Write-Host "Exiting after error" -fore red
            Exit
        }
        Invoke-TryDotnetPublish $project -c $configuration -o $outDir -v $versionPrefix -e $buildenv $args    
    }
}
Export-ModuleMember -Function Invoke-TryDotnetPublish

function Invoke-DotnetPack($project, [Alias("c")] $configuration="Release", [Alias("o")] $outDir="./artifacts", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    $project = (Resolve-Path "$project").Path
    & $dotnet pack $project --nologo -c $configuration -o $outDir $args
}
Export-ModuleMember -Function Invoke-DotnetPack

function Invoke-DotnetClean($project, [Alias("c")] $configuration="Release", [Parameter(ValueFromRemainingArguments=$true)][string[]] $args)
{
    $dotnet = Get-DotnetCli
    $project = (Resolve-Path "$project").Path
    & $dotnet clean $project --nologo -c $configuration $args
}
Export-ModuleMember -Function Invoke-DotnetClean

function Invoke-PatchProjectVersion($project,$versionInfo) {
    # Patch project file for version synchronisation
    $proj = [xml](Get-Content $project)
    # test if version tag is present or not and if propertygroups exist for build or not
    $ver = $proj.SelectNodes("//VersionPrefix")
    $build = $proj.SelectNodes("//PropertyGroup[Label='Build']")
    $targ = $proj.SelectNodes("//PropertyGroup/TargetFramework")
    if ($ver.Count -ge 1) {
        $ver.Item(0).InnerText = $versionInfo
    } else {
        if ($build.Count -eq 1) {
            # create versionprefix tag
            $tag=$proj.CreateElement("VersionPrefix");
            $tex=$proj.CreateTextNode($versioninfo);
            $tag.AppendChild($tex)
            $build.Item(0).AppendChild($tag)
        } else {
            if ($targ.Count -eq 1) {
                # create versionprefix tag
                $tag=$proj.CreateElement("VersionPrefix");
                $tex=$proj.CreateTextNode($versioninfo);
                $tag.AppendChild($tex)
                $targ.Item(0).ParentNode.AppendChild($tag)
            } else {
                # create default PropertyGroup
                $prop=$proj.CreateElement("PropertyGroup");
                $prop.Label="Build"
                $tag=$proj.CreateElement("VersionPrefix");
                $tex=$proj.CreateTextNode($versioninfo);
                $tag.AppendChild($tex)
                $prop.AppendChild($tag)            
                $proj.root.AppendChild($tag)            
            }            
        }
    }
    $proj.Save($project)
}
Export-ModuleMember -Function Invoke-PatchProjectVersion


function Invoke-GetProjectVersion($project) {
    # Patch project file for version synchronisation
    $proj = [xml](Get-Content $project)
    # test if version tag is present or not and if propertygroups exist for build or not
    $ver = $proj.SelectNodes("//VersionPrefix")
    $build = $proj.SelectNodes("//PropertyGroup[Label='Build']")
    $targ = $proj.SelectNodes("//PropertyGroup/TargetFramework")
    if ($ver.Count -ge 1) {
        return $ver.Item(0)."#text"
    } 
}
Export-ModuleMember -Function Invoke-GetProjectVersion



function Invoke-GetProjectLocation($type) {
    # Find project matching pattern
    $curpath = Get-Location
    $pattern = "*" + $type + "*.*proj"  
    $res = Get-ChildItem -Path $curpath -Include $pattern -Recurse -ErrorAction SilentlyContinue
    # test for 1 result only
    if (($res -eq $null) -or (@($res).count -ne 1)) {
        Write-Host "Unable to locate $type project file !" -Fore red
        Exit
    } else {
        return $res.FullName
    }
}
Export-ModuleMember -Function Invoke-GetProjectLocation



function Get-DotnetCli()
{
    return (Get-Command "dotnet").Path
}
