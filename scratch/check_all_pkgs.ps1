$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$base = "https://sandbox-api-ok.metrc.com"

Write-Host "========== 1. ACTIVE packages in SF-SBX-OK-2-6801 =========="
$r1 = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=SF-SBX-OK-2-6801"
Write-Host $r1

Write-Host ""
Write-Host "========== 2. INACTIVE packages in SF-SBX-OK-2-6801 =========="
$r2 = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/inactive?licenseNumber=SF-SBX-OK-2-6801"
Write-Host $r2

Write-Host ""
Write-Host "========== 3. ON-HOLD packages in SF-SBX-OK-2-6801 =========="
$r3 = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/onhold?licenseNumber=SF-SBX-OK-2-6801"
Write-Host $r3

Write-Host ""
Write-Host "========== 4. ACTIVE packages in SF-SBX-OK-1-6801 =========="
$r4 = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=SF-SBX-OK-1-6801"
Write-Host $r4

Write-Host ""
Write-Host "========== ALL CHECKS COMPLETE =========="
