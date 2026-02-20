# WhatsApp Ordering PWA - Deployment Script
# This script automates the deployment process

Write-Host "🚀 WhatsApp Ordering PWA Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check if production environment file exists
Write-Host ""
Write-Host "Checking production environment..." -ForegroundColor Yellow
if (!(Test-Path "src/environments/environment.prod.ts")) {
    Write-Host "❌ Production environment file not found!" -ForegroundColor Red
    Write-Host "Please create src/environments/environment.prod.ts with your production configuration." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Production environment file found" -ForegroundColor Green
}

# Run linting
Write-Host ""
Write-Host "Running linter..." -ForegroundColor Yellow
$lintChoice = Read-Host "Do you want to run linting? (Y/n)"
if ($lintChoice -ne "n" -and $lintChoice -ne "N") {
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Linting found issues. Continue anyway? (Y/n)" -ForegroundColor Yellow
        $continueChoice = Read-Host
        if ($continueChoice -eq "n" -or $continueChoice -eq "N") {
            exit 1
        }
    } else {
        Write-Host "✅ Linting passed" -ForegroundColor Green
    }
}

# Build for production
Write-Host ""
Write-Host "Building for production..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Check if build output exists
Write-Host ""
Write-Host "Verifying build output..." -ForegroundColor Yellow
$buildPath = "dist/whatsapp-ordering-pwa/browser"
if (!(Test-Path $buildPath)) {
    Write-Host "❌ Build output not found at $buildPath" -ForegroundColor Red
    exit 1
}

$indexPath = "$buildPath/index.html"
$swPath = "$buildPath/ngsw-worker.js"
$manifestPath = "$buildPath/manifest.webmanifest"

if (Test-Path $indexPath) {
    Write-Host "✅ index.html found" -ForegroundColor Green
} else {
    Write-Host "❌ index.html not found" -ForegroundColor Red
}

if (Test-Path $swPath) {
    Write-Host "✅ Service worker found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Service worker not found - PWA features may not work" -ForegroundColor Yellow
}

if (Test-Path $manifestPath) {
    Write-Host "✅ PWA manifest found" -ForegroundColor Green
} else {
    Write-Host "⚠️  PWA manifest not found - App may not be installable" -ForegroundColor Yellow
}

# Display build size
Write-Host ""
Write-Host "Build size information:" -ForegroundColor Cyan
$totalSize = (Get-ChildItem -Path $buildPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ("Total build size: {0:N2} MB" -f $totalSize) -ForegroundColor White

# Ask about deployment method
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor Cyan
Write-Host "1. Firebase Hosting" -ForegroundColor White
Write-Host "2. Manual deployment (just build)" -ForegroundColor White
Write-Host "3. Exit" -ForegroundColor White
$deployChoice = Read-Host "Enter your choice (1-3)"

switch ($deployChoice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Yellow
        
        # Check if Firebase CLI is installed
        try {
            $firebaseVersion = firebase --version
            Write-Host "✅ Firebase CLI version: $firebaseVersion" -ForegroundColor Green
        } catch {
            Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
            Write-Host "Install it with: npm install -g firebase-tools" -ForegroundColor Yellow
            exit 1
        }
        
        # Deploy
        Write-Host "Deploying..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "🎉 Deployment successful!" -ForegroundColor Green
            Write-Host "Your app is now live!" -ForegroundColor Green
        } else {
            Write-Host "❌ Deployment failed!" -ForegroundColor Red
            exit 1
        }
    }
    "2" {
        Write-Host ""
        Write-Host "✅ Build completed. Deploy the contents of:" -ForegroundColor Green
        Write-Host "   $buildPath" -ForegroundColor White
        Write-Host "   to your hosting provider." -ForegroundColor White
    }
    "3" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deployment process completed!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your deployed app thoroughly" -ForegroundColor White
Write-Host "2. Run Lighthouse audit for PWA score" -ForegroundColor White
Write-Host "3. Test on mobile devices" -ForegroundColor White
Write-Host "4. Monitor Firebase console for errors" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
