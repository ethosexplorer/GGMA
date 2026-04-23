$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$base = "https://sandbox-api-ok.metrc.com"
$scratch = "c:\GGMA\GGMA\scratch"

Write-Host "===== 1. Grower Active Packages ====="
$r1 = curl.exe -s -w "`nHTTP_CODE:%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=SF-SBX-OK-3-6801"
$r1 | Out-File "$scratch\grower_pkgs_result.txt" -Encoding UTF8
$lines = $r1 -split "`n"
Write-Host "HTTP Code: $($lines[-1])"
Write-Host "Total records in response: $(($r1 | Select-String 'TotalRecords').Matches.Count)"
# Just show total count
$r1 -match '"Total":(\d+)' | Out-Null
if ($Matches) { Write-Host "Total packages: $($Matches[1])" }

Write-Host ""
Write-Host "===== 2. Opening Balance on Sales License ====="
$body = '[{"Tag":"AAA0E0100000D13000000984","Item":"GGP Immature Clone","Quantity":10.0,"UnitOfMeasure":"Each","ActualDate":"2026-04-23"}]'
Set-Content -Path "$scratch\opening_balance.json" -Value $body -NoNewline
$r2 = curl.exe -s -w "`nHTTP_CODE:%{http_code}" -u $cred -X POST "$base/packages/v2/create/openingbalance?licenseNumber=SF-SBX-OK-2-6801" -H "Content-Type: application/json" --data-binary "@$scratch\opening_balance.json"
Write-Host $r2
