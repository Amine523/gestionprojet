@echo off
setlocal enabledelayedexpansion

REM Generate REST Client with OpenAPI JAR Generator and package as NuGet
powershell -ExecutionPolicy Bypass -File "GenerateRestClientWithNuget.ps1" ^
  -ProjectFilePath "..\..\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.WebApi.csproj" ^
  -WebApiJsonPath "..\..\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete\webapi.json" ^
  -DestPath "..\..\..\..\RestClient" ^
  -ApiName "Gestprojet.Core.ApiParamSociete" ^
  -Version "1.0.0"

pause