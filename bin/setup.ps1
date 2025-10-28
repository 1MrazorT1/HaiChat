$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

if (!(Test-Path "$Root\.env")) {
  Copy-Item "$Root\.env.example" "$Root\.env"
  Write-Host "Created .env from .env.example"
}

$envContent = Get-Content "$Root\.env"
$line = $envContent | Where-Object { $_ -match '^MISTRAL_API_KEY=' }
if ($line -and ($line -ne 'MISTRAL_API_KEY=')) {
  Write-Host "MISTRAL_API_KEY already set in .env"
} else {
  $key = Read-Host "Enter your Mistral API key (sk-...)"
  $newContent = $envContent -replace '^MISTRAL_API_KEY=.*', "MISTRAL_API_KEY=$key"
  Set-Content -Path "$Root\.env" -Value $newContent
  Write-Host "Saved MISTRAL_API_KEY to .env"
}

Write-Host "Done. You can now run:  docker compose up --build"
