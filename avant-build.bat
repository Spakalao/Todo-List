@echo off
echo Correction des permissions Docker pour Jenkins...
docker exec -u root jenkins chmod 666 /var/run/docker.sock
echo Verifications...
docker exec jenkins docker ps
echo.
echo Permissions corrigees! Vous pouvez maintenant lancer le build dans Jenkins.
pause

