# PowerShell script to refactor Angular components from inline templates to separate files

$components = @(
    "src\app\app.component.ts",
    "src\app\features\admin\admin-login\admin-login.component.ts",
    "src\app\features\admin\sellers-management\sellers-management.component.ts",
    "src\app\features\seller\components\seller-header.component.ts",
    "src\app\features\seller\login\seller-login.component.ts",
    "src\app\features\seller\dashboard\dashboard.component.ts",
    "src\app\features\seller\products-management\products-management.component.ts",
    "src\app\features\seller\orders-management\orders-management.component.ts",
    "src\app\features\customer\home\home.component.ts",
    "src\app\features\customer\products\products.component.ts",
    "src\app\features\customer\product-details\product-details.component.ts",
    "src\app\features\customer\cart\cart.component.ts"
)

function Extract-Template
{
    param ([string]$filePath)
    
    $content = Get-Content $filePath -Raw
    
    # Extract template
    if ($content -match '(?s)template:\s*`([^`]*)`')
    {
        $template = $matches[1]
        return $template
    }
    
    return $null
}

function Extract-Styles
{
    param ([string]$filePath)
    
    $content = Get-Content $filePath -Raw
    
    # Extract styles
    if ($content -match '(?s)styles:\s*\[`([^`]*)`\]')
    {
        $styles = $matches[1]
        return $styles
    }
    
    return $null
}

function Update-ComponentDecorator
{
    param (
        [string]$filePath,
        [string]$componentName
    )
    
    $content = Get-Content $filePath -Raw
    
    # Replace template: with templateUrl:
    $content = $content -replace "template:\s*`[^`]*`\s*,", "templateUrl: './$componentName.html',"
    
    # Replace styles: with styleUrl:
    $content = $content -replace "styles:\s*\[`[^`]*`\]", "styleUrl: './$componentName.scss'"
    
    Set-Content -Path $filePath -Value $content
}

Write-Host "Starting component refactoring..." -ForegroundColor Cyan
Write-Host ""

$totalComponents = $components.Count
$currentIndex = 0

foreach ($componentPath in $components)
{
    $currentIndex++
    $fullPath = Join-Path $PSScriptRoot $componentPath
    
    if (Test-Path $fullPath)
    {
        $directory = Split-Path $fullPath -Parent
        $fileName = Split-Path $fullPath -Leaf
        $componentName = $fileName -replace '\.component\.ts$', ''
        
        Write-Host "[$currentIndex/$totalComponents] Processing: $componentName" -ForegroundColor Yellow
        
        # Extract template
        $template = Extract-Template -filePath $fullPath
        if ($template)
        {
            $htmlPath = Join-Path $directory "$componentName.component.html"
            Set-Content -Path $htmlPath -Value $template
            Write-Host "  Created $componentName.component.html" -ForegroundColor Green
        }
        else
        {
            Write-Host "  No inline template found" -ForegroundColor DarkYellow
        }
        
        # Extract styles
        $styles = Extract-Styles -filePath $fullPath
        if ($styles)
        {
            $scssPath = Join-Path $directory "$componentName.component.scss"
            Set-Content -Path $scssPath -Value $styles
            Write-Host "  Created $componentName.component.scss" -ForegroundColor Green
        }
        else
        {
            Write-Host "  No inline styles found" -ForegroundColor DarkYellow
        }
        
        # Update component decorator
        Update-ComponentDecorator -filePath $fullPath -componentName $componentName
        Write-Host "  Updated $fileName" -ForegroundColor Green
        Write-Host ""
    }
    else
    {
        Write-Host "  File not found: $fullPath" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "Refactoring complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  - Processed $totalComponents components" -ForegroundColor White
Write-Host "  - Created separate HTML and SCSS files" -ForegroundColor White
Write-Host "  - Updated component decorators" -ForegroundColor White
Write-Host ""
Write-Host "Please verify the changes and test the application!" -ForegroundColor Yellow
