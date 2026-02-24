# Script to update component files to use external templates and styles

$files = @{
    "src/app/features/admin/sellers-management/sellers-management.component.ts" = "sellers-management"
    "src/app/features/seller/components/seller-header.component.ts" = "seller-header"
    "src/app/features/seller/login/seller-login.component.ts" = "seller-login"
    "src/app/features/seller/dashboard/dashboard.component.ts" = "dashboard"
    "src/app/features/seller/products-management/products-management.component.ts" = "products-management"
    "src/app/features/seller/orders-management/orders-management.component.ts" = "orders-management"
    "src/app/features/customer/home/home.component.ts" = "home"
    "src/app/features/customer/products/products.component.ts" = "products"
    "src/app/features/customer/product-details/product-details.component.ts" = "product-details"
    "src/app/features/customer/cart/cart.component.ts" = "cart"
}

foreach ($file in $files.Keys) {
    $componentName = $files[$file]
    Write-Host "`nProcessing: $file" -ForegroundColor Cyan
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Find the @Component decorator and replace template/styles
        $pattern = '(@Component\([^)]*\s+)(template:\s*`[^`]*`,?\s*)(styles:\s*\[[^\]]*\],?\s*)'
        $replacement = "`$1templateUrl: './$componentName.component.html',`n  styleUrl: './$componentName.component.scss'"
        
        if ($content -match $pattern) {
            $newContent = $content -replace $pattern, $replacement
            Set-Content $file -Value $newContent -NoNewline
            Write-Host "✓ Updated: $file" -ForegroundColor Green
        } else {
            Write-Host "✗ Pattern not found in: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✓ All files processed!" -ForegroundColor Green
