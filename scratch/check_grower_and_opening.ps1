$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$base = "https://sandbox-api-ok.metrc.com"
$scratch = "c:\GGMA\GGMA\scratch"

Write-Host "========== 1. ACTIVE packages in SF-SBX-OK-3-6801 (Grower) =========="
$r1 = curl.exe -s -w "`n%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=SF-SBX-OK-3-6801"
Write-Host $r1

Write-Host ""
Write-Host "========== 2. Create Opening Balance on SF-SBX-OK-2-6801 (Sales) =========="
$body = '[{"Tag":"AAA0E0100000D13000000984","Item":"GGP Immature Clone","Quantity":10.0,"UnitOfMeasure":"Each","ActualDate":"2026-04-23"}]'
Set-Content -Path "$scratch\opening_balance.json" -Value $body -NoNewline
$r2 = curl.exe -s -w "`n%{http_code}" -u $cred -X POST "$base/packages/v2/create/openingbalance?licenseNumber=SF-SBX-OK-2-6801" -H "Content-Type: application/json" --data-binary "@$scratch\opening_balance.json"
Write-Host $r2

Write-Host ""
Write-Host "========== DONE =========="
