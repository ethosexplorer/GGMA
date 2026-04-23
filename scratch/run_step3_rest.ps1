$body = Get-Content -Path "c:\GGMA\GGMA\scratch\step3_data.json" -Raw
$headers = @{
    "Authorization" = "Basic bmJZLU1tVGJJTHljZUFlMml6VzR2TzZHSUxscUhVNWE5czJ5U2FJU2lPR3RScTZ2OjVVNTVKOUp4allFZ2w2dmxibG1KUmlyTjh4RnJ3T0x0Rzk5NWtDdDdKUjVxeEo4aw=="
    "Content-Type" = "application/json"
}
try {
    $response = Invoke-RestMethod -Uri "https://sandbox-api-ok.metrc.com/plants/v2/plantbatch/packages?licenseNumber=SF-SBX-OK-3-6801" -Method Post -Body $body -Headers $headers
    $response | ConvertTo-Json
} catch {
    Write-Error $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Output "Response Body: $responseBody"
    }
}
