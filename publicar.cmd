@echo off
rem Publica o jogo: salva mudancas, envia pro GitHub e atualiza o site.
rem Funciona com dois cliques, no cmd ou no PowerShell (.\publicar.cmd).
cd /d "%~dp0"
call gh auth switch -u Gyshro || goto fim
git add -A
git diff --cached --quiet || git commit -m "atualiza jogo" || goto volta
git push || goto volta
call npm run deploy
:volta
call gh auth switch -u filtroazul
:fim
echo.
echo Site: https://gyshro.github.io/aniversario-sapinha/
pause
