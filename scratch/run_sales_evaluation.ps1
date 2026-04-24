$ErrorActionPreference = 'Stop'

# Metrc API Authentication
# Uses the correct Integrator Software Key + User API Key
$softwareKey = "nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v"
$userKey = "5U55J9JxjyEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k"
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($softwareKey):$($userKey)"))

$headers = @{ 
    "Authorization" = "Basic $auth" 
    "Content-Type" = "application/json"
}

# 1. Fetch available packages in the sales facility (SF-SBX-OK-2-6801)
Write-Host "Checking for active packages in SF-SBX-OK-2-6801..." -ForegroundColor Cyan
$packagesUrl = "https://sandbox-api-ok.metrc.com/packages/v1/active?licenseNumber=SF-SBX-OK-2-6801"
$packagesResponse = Invoke-RestMethod -Uri $packagesUrl -Method Get -Headers $headers

if ($packagesResponse.Count -eq 0 -or $packagesResponse.value.Count -eq 0) {
    Write-Host "ERROR: There are currently NO active packages in SF-SBX-OK-2-6801." -ForegroundColor Red
    Write-Host "Metrc has not yet provisioned the test packages into this facility." -ForegroundColor Yellow
    Write-Host "Please email Metrc and ask them to add a test package to SF-SBX-OK-2-6801 so you can complete the Sales API evaluation." -ForegroundColor Yellow
    exit
}

$targetPackage = $packagesResponse.value[0].Label
Write-Host "Found active package: $targetPackage" -ForegroundColor Green

# 2. Create the Sales Receipt Payload using the actual package label
$salesDateTime = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.000")
$salesPayload = @(
    @{
        SalesDateTime = $salesDateTime
        PatientLicenseNumber = "PATIENT-12345"
        Transactions = @(
            @{
                PackageLabel = $targetPackage
                Quantity = 1
                UnitOfMeasure = "Each"
                TotalAmount = 50.00
            }
        )
    }
) | ConvertTo-Json -Depth 5

Write-Host "Posting Sales Receipt to Metrc..." -ForegroundColor Cyan
$salesUrl = "https://sandbox-api-ok.metrc.com/sales/v1/receipts?licenseNumber=SF-SBX-OK-2-6801"

try {
    $salesResponse = Invoke-RestMethod -Uri $salesUrl -Method Post -Headers $headers -Body $salesPayload
    Write-Host "SUCCESS! Sales Receipt posted." -ForegroundColor Green
    Write-Host "Evaluation step complete. You can now notify Metrc." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to post Sales Receipt." -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Metrc Error Details: $errorBody" -ForegroundColor Red
    }
}
