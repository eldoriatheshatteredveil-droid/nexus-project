# Downloads a few trusted OpenGameArt MP3s into public/music/
# Usage (PowerShell):
#   ./scripts/fetch-music.ps1

$destDir = Join-Path $PSScriptRoot "..\public\music"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$tracks = @(
    @{ url = 'https://opengameart.org/sites/default/files/Cyberpunk%20City_0.mp3'; file = 'cyberpunk_city_eric_matyas.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/Lines%20of%20Code_0.mp3'; file = 'lines_of_code_trevor_lentz.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/Cyberpunk%20Moonlight%20Sonata_0.mp3'; file = 'moonlight_sonata_cyber_joth.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/Deus%20Ex%20Tempus_0.mp3'; file = 'deus_ex_tempus_trevor_lentz.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/ChillLofiR_0.mp3'; file = 'chill_lofi_omfgdude.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/155%20November_snow-33_tape_leveled.mp3'; file = 'november_snow_cynicmusic.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/8_bit_cold_lake_lofi.mp3'; file = 'cold_lake_tad.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/cda98e895139.mp3'; file = 'shinsei_obscure_music.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/cyberpunk_arcade_3_0.mp3'; file = 'cyberpunk_arcade_3_eric_matyas.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/cyberpunk.mp3'; file = 'cyberpunk_beauty_tarush_singhal.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/trevor_lentz_-_cyberpunk-_genesis_-_01_cyberpunk-_genesis.mp3'; file = 'cyberpunk_genesis_trevor_lentz.mp3' },
    @{ url = 'https://opengameart.org/sites/default/files/space_boss_battle_bpm175.mp3'; file = 'space_boss_battle_mintodog.mp3' }
)

Write-Output "Downloading ${($tracks).Count} tracks to: $destDir"

foreach ($t in $tracks) {
    $outPath = Join-Path $destDir $t.file
    try {
        Write-Output "Downloading $($t.url) -> $outPath"
        Invoke-WebRequest -Uri $t.url -OutFile $outPath -UseBasicParsing -TimeoutSec 60
        Write-Output "Saved: $outPath"
    } catch {
        Write-Output "ERROR downloading $($t.url): $($_.Exception.Message)"
    }
}

Write-Output "Done. Start the dev server and open the audio panel to play local tracks at /music/*.mp3"
