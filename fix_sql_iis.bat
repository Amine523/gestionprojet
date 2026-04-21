%windir%\system32\inetsrv\appcmd.exe set config -section:applicationPools "/[name='GestprojetApiPool'].processModel.identityType:LocalSystem"
iisreset /restart
