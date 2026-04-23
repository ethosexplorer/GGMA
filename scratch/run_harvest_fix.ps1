$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$license = "SF-SBX-OK-3-6801"
$base = "https://sandbox-api-ok.metrc.com"
$scratch = "c:\GGMA\GGMA\scratch"

Write-Host "========== STEP 1 (CORRECTED): Create Package from Harvest =========="
$r1 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/packages?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h1_fixed.json"
Write-Host $r1

Write-Host ""
Write-Host "========== STEP 2 (CORRECTED): Report Waste on Harvest =========="
$r2 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/harvests/v2/waste?licenseNumber=$license" -H "Content-Type: application/json" --data-binary "@$scratch\h2_fixed.json"
Write-Host $r2

Write-Host ""
Write-Host "========== DONE =========="
