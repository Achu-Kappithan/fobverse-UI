$tsFiles = Get-ChildItem -Path ".\src" -Recurse -Include *.ts
$totalFiles = $tsFiles.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles TypeScript files to process..." -ForegroundColor Cyan

foreach ($file in $tsFiles) {
    $processedFiles++
    Write-Host "[$processedFiles/$totalFiles] Processing: $($file.Name)" -ForegroundColor Gray
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Remove multi-line comments (/* */ and /** */)
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    
    # Remove single-line comments (//)
    $content = $content -replace '(?<!:)//(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)(?![^'']*''(?:(?:[^'']*''){2})*[^'']*$)[^\r\n]*', ''
    
    # Remove empty lines that were left after comment removal (more than 2 consecutive empty lines)
    $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
    
    # Trim trailing whitespace from each line
    $content = $content -replace '[ \t]+(\r?\n)', '$1'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "  Modified" -ForegroundColor Green
    } else {
        Write-Host "  No comments found" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Complete!" -ForegroundColor Green
Write-Host "Processed: $processedFiles files" -ForegroundColor Cyan
Write-Host "Modified: $modifiedFiles files" -ForegroundColor Yellow
