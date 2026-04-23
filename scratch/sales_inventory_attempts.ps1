$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$base = "https://sandbox-api-ok.metrc.com"
$scratch = "c:\GGMA\GGMA\scratch"

# --- Attempt 1: Check available tags on the sales license ---
Write-Host "===== 1. Available Tags on SF-SBX-OK-2-6801 ====="
$r1 = curl.exe -s -w "`nHTTP:%{http_code}" -u $cred "$base/tags/v2/available?licenseNumber=SF-SBX-OK-2-6801"
$t1 = [string]$r1
Write-Host $t1.Substring(0, [Math]::Min(500, $t1.Length))

Write-Host ""

# --- Attempt 2: Check items on the sales license ---
Write-Host "===== 2. Items on SF-SBX-OK-2-6801 ====="
$r2 = curl.exe -s -w "`nHTTP:%{http_code}" -u $cred "$base/items/v2/active?licenseNumber=SF-SBX-OK-2-6801"
$t2 = [string]$r2
Write-Host $t2.Substring(0, [Math]::Min(500, $t2.Length))

Write-Host ""

# --- Attempt 3: Try creating a package directly (v1 endpoint) ---
Write-Host "===== 3. Create Package (v1) on SF-SBX-OK-2-6801 ====="
$body3 = '[{"Tag":"AAA0E0100000D13000000984","Item":"GGP Immature Clone","Quantity":10.0,"UnitOfMeasure":"Each","ActualDate":"2026-04-23"}]'
Set-Content -Path "$scratch\sales_pkg.json" -Value $body3 -NoNewline
$r3 = curl.exe -s -w "`nHTTP:%{http_code}" -u $cred -X POST "$base/packages/v1/create?licenseNumber=SF-SBX-OK-2-6801" -H "Content-Type: application/json" --data-binary "@$scratch\sales_pkg.json"
Write-Host $r3

Write-Host ""

# --- Attempt 4: Try transfers/v2/external/incoming ---
Write-Host "===== 4. Check Transfer Templates ====="
$r4 = curl.exe -s -w "`nHTTP:%{http_code}" -u $cred "$base/transfers/v2/templates?licenseNumber=SF-SBX-OK-3-6801"
$t4 = [string]$r4
Write-Host $t4.Substring(0, [Math]::Min(500, $t4.Length))

Write-Host ""

# --- Attempt 5: Re-check if Metrc added packages yet ---
Write-Host "===== 5. Final Re-check Active Packages in SF-SBX-OK-2-6801 ====="
$r5 = curl.exe -s -w "`nHTTP:%{http_code}" -u $cred "$base/packages/v2/active?licenseNumber=SF-SBX-OK-2-6801"
Write-Host $r5

Write-Host ""
Write-Host "===== ALL ATTEMPTS COMPLETE ====="
