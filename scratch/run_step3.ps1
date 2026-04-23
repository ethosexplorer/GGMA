$json = '[{
  "PlantBatchId": 5401,
  "LocationName": "Processing Area - Updated",
  "ItemName": "GGP Test Item",
  "Quantity": 1,
  "Tag": "AAA0E0100000D13000001001",
  "ActualDate": "2026-04-22"
}]'

curl.exe -u nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v:5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k `
-X POST "https://sandbox-api-ok.metrc.com/plants/v2/plantbatch/packages?licenseNumber=SF-SBX-OK-3-6801" `
-H "Content-Type: application/json" `
-d $json
