$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$license = "SF-SBX-OK-2-6801"
$base = "https://sandbox-api-ok.metrc.com"

Write-Host "========== Active Packages in SF-SBX-OK-2-6801 (Sales License) =========="
$r = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=$license"
Write-Host $r
