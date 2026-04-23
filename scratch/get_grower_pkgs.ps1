$cred = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$r = curl.exe -s -u $cred "https://sandbox-api-ok.metrc.com/packages/v2/active?licenseNumber=SF-SBX-OK-3-6801"
$text = [string]$r
Write-Host $text.Substring(0, [Math]::Min(3000, $text.Length))
