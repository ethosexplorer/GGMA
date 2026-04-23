$ErrorActionPreference = "Continue"

$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$license = "SF-SBX-OK-3-6801"
$base = "https://sandbox-api-ok.metrc.com"
$scratch = "c:\GGMA\GGMA\scratch"

# Write JSON bodies to files to avoid PowerShell escaping issues
$body1 = '[{"HarvestName":"GGP Harvest Test","Tag":"AAA0E0100000D13000000989","Item":"GGP Immature Clone","Weight":50.0,"UnitOfMeasure":"Grams","ActualDate":"2026-04-23"}]'
$body2 = '[{"Id":3802,"WasteReasonName":"Damage/Spoilage","WasteWeight":10.0,"UnitOfMeasure":"Grams","ActualDate":"2026-04-23"}]'
$body3 = '[{"Id":3802,"ActualDate":"2026-04-23"}]'
$body4 = '[{"Id":3802}]'

Set-Content -Path "$scratch\h1.json" -Value $body1 -NoNewline
Set-Content -Path "$scratch\h2.json" -Value $body2 -NoNewline
Set-Content -Path "$scratch\h3.json" -Value $body3 -NoNewline
Set-Content -Path "$scratch\h4.json" -Value $body4 -NoNewline

Write-Host "========== STEP 1: Create Package from Harvest =========="
$r1 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/packages?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h1.json"
Write-Host $r1

Write-Host ""
Write-Host "========== STEP 2: Report Waste on Harvest =========="
$r2 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/waste?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h2.json"
Write-Host $r2

Write-Host ""
Write-Host "========== STEP 3: Finish the Harvest =========="
$r3 = curl.exe -s -w "`n%{http_code}" -u $cred -X PUT "$base/harvests/v2/finish?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h3.json"
Write-Host $r3

Write-Host ""
Write-Host "========== STEP 4: Unfinish the Harvest =========="
$r4 = curl.exe -s -w "`n%{http_code}" -u $cred -X PUT "$base/harvests/v2/unfinish?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h4.json"
Write-Host $r4

Write-Host ""
Write-Host "========== ALL 4 HARVEST STEPS COMPLETE =========="
