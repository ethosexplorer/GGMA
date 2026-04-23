$ErrorActionPreference = "Continue"

$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$license = "SF-SBX-OK-3-6801"
$base = "https://sandbox-api-ok.metrc.com"

Write-Host "========== STEP 1: Create Package from Harvest =========="
$body1 = '[{"HarvestName":"GGP Harvest Test","Tag":"AAA0E0100000D13000000989","Item":"GGP Immature Clone","Weight":50.0,"UnitOfMeasure":"Grams","ActualDate":"2026-04-23"}]'
try {
    $r1 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/packages?licenseNumber=$license" -H "Content-Type: application/json" -d $body1
    Write-Host $r1
} catch { Write-Host "ERROR: $_" }

Write-Host ""
Write-Host "========== STEP 2: Report Waste on Harvest =========="
$body2 = '[{"Id":3802,"WasteReasonName":"Damage/Spoilage","WasteWeight":10.0,"UnitOfMeasure":"Grams","ActualDate":"2026-04-23"}]'
try {
    $r2 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/waste?licenseNumber=$license" -H "Content-Type: application/json" -d $body2
    Write-Host $r2
} catch { Write-Host "ERROR: $_" }

Write-Host ""
Write-Host "========== STEP 3: Finish the Harvest =========="
$body3 = '[{"Id":3802,"ActualDate":"2026-04-23"}]'
try {
    $r3 = curl.exe -s -w "`n%{http_code}" -u $cred -X PUT "$base/harvests/v2/finish?licenseNumber=$license" -H "Content-Type: application/json" -d $body3
    Write-Host $r3
} catch { Write-Host "ERROR: $_" }

Write-Host ""
Write-Host "========== STEP 4: Unfinish the Harvest =========="
$body4 = '[{"Id":3802}]'
try {
    $r4 = curl.exe -s -w "`n%{http_code}" -u $cred -X PUT "$base/harvests/v2/unfinish?licenseNumber=$license" -H "Content-Type: application/json" -d $body4
    Write-Host $r4
} catch { Write-Host "ERROR: $_" }

Write-Host ""
Write-Host "========== ALL 4 HARVEST STEPS COMPLETE =========="
