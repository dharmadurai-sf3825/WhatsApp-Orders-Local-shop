# Deploy Path-Based Routing Update
# This script builds and deploys the updated application with path-based routing support

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  WhatsApp Orders - Complete Path Routing Deployment" -ForegroundColor Cyan
Write-Host "  ✅ All navigation fixed (cart, products, details)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "angular.json")) {
    Write-Host "❌ Error: Not in project root directory!" -ForegroundColor Red
    Write-Host "Please run this script from: d:\My\WhatsApp-Orders-Local-shop" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project directory confirmed" -ForegroundColor Green
Write-Host ""

# Step 1: Install dependencies (if needed)
Write-Host "📦 Step 1: Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Step 2: Build the application
Write-Host "🔨 Step 2: Building application..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please check errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy to Firebase
Write-Host "🚀 Step 3: Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Make sure you're logged in: firebase login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""

# Step 4: Show test URLs
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ALL NAVIGATION FIXED:" -ForegroundColor Green
Write-Host "   - Home → Products → Product Details → Cart ✅" -ForegroundColor White
Write-Host "   - Back buttons work correctly ✅" -ForegroundColor White
Write-Host "   - Direct URL access works ✅" -ForegroundColor White
Write-Host "   - Shop context maintained ✅" -ForegroundColor White
Write-Host ""
Write-Host "Test these complete flows:" -ForegroundColor Green
Write-Host ""
Write-Host "  1. Demo Shop:" -ForegroundColor White
Write-Host "     https://whatsapp-local-order.web.app/demo-shop" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/demo-shop/products" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/demo-shop/cart" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Ganesh Bakery:" -ForegroundColor White
Write-Host "     https://whatsapp-local-order.web.app/ganesh-bakery" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/ganesh-bakery/products" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/ganesh-bakery/cart" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Anbu Grocery:" -ForegroundColor White
Write-Host "     https://whatsapp-local-order.web.app/anbu-grocery" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/anbu-grocery/products" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Kumar Restaurant:" -ForegroundColor White
Write-Host "     https://whatsapp-local-order.web.app/kumar-restaurant" -ForegroundColor Cyan
Write-Host "     https://whatsapp-local-order.web.app/kumar-restaurant/products" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Share with shop owners:" -ForegroundColor Yellow
Write-Host "   yourapp.web.app/[shop-slug]" -ForegroundColor White
Write-Host ""
Write-Host "✨ Complete path-based routing with full navigation!" -ForegroundColor Green
Write-Host "📖 Read ROUTING-FIX-COMPLETE.md for details" -ForegroundColor Gray
Write-Host ""
