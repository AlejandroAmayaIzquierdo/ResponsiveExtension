# Define the commands to run
$cleanCommand = "npm run clean"
$buildCommand = "npm run build"

# Run npm run clean
Write-Host "Running '$cleanCommand'..."
Invoke-Expression -Command $cleanCommand

# Check the exit code of npm run clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm run clean failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}

# Run npm run build
Write-Host "Running '$buildCommand'..."
Invoke-Expression -Command $buildCommand

# Check the exit code of npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm run build failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}

Write-Host "npm run clean and npm run build completed successfully."
