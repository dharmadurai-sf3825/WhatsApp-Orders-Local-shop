# 🔒 GitHub Security Setup Guide

## ⚠️ CRITICAL: Protect Your API Keys

Since you've already committed this project to GitHub, follow these steps to secure your environment files and prevent API key exposure.

---

## 📋 Current Status

✅ `.gitignore` already excludes `/src/environments/environment.prod.ts`  
⚠️ Environment files with placeholders may be in Git history

---

## 🛡️ Step 1: Create Template Files (Safe for GitHub)

### Create `environment.template.ts` (Safe to commit)

```bash
# Create a template file that can be safely committed
```

Create `src/environments/environment.template.ts`:

```typescript
// Copy this file to environment.ts and environment.prod.ts
// Replace placeholder values with your actual configuration
export const environment = {
  production: false, // Set to true for production
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  razorpay: {
    keyId: 'YOUR_RAZORPAY_KEY_ID',
    keySecret: 'YOUR_RAZORPAY_KEY_SECRET'
  },
  whatsapp: {
    businessNumber: '919876543210', // E.164 format without +
    defaultMessage: 'Hello, I want to place an order'
  }
};
```

---

## 🔥 Step 2: Update `.gitignore` (Enhanced Protection)

Your `.gitignore` is good, but let's make it even better:

```gitignore
# Environment files (NEVER commit real credentials!)
/src/environments/environment.ts
/src/environments/environment.prod.ts
/src/environments/environment.*.ts
!src/environments/environment.template.ts

# Environment variables
.env
.env.local
.env.*.local
*.env

# Firebase sensitive files
.firebaserc
firebase-debug.log
.firebase/

# API Keys and Secrets
**/api-keys.json
**/secrets.json
**/*secret*.ts
**/*secret*.json
```

---

## 🧹 Step 3: Remove Sensitive Files from Git History

### Option A: Remove from Future Commits Only (Recommended for now)

```powershell
# Stop tracking the files (but keep them locally)
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.prod.ts

# Commit the changes
git add .gitignore
git commit -m "chore: Remove environment files from Git tracking"
git push
```

### Option B: Remove from Git History Completely (Advanced)

⚠️ **Warning:** This rewrites Git history. Only do this if:
- You haven't shared your repository with others yet
- OR you've accidentally committed real API keys

```powershell
# Using git filter-repo (recommended method)
# First, install git-filter-repo: pip install git-filter-repo

git filter-repo --path src/environments/environment.ts --invert-paths
git filter-repo --path src/environments/environment.prod.ts --invert-paths

# Force push (CAUTION: This rewrites history!)
git push origin --force --all
```

**Alternative using BFG Repo-Cleaner:**
```powershell
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
# Then run:
java -jar bfg.jar --delete-files environment.ts
java -jar bfg.jar --delete-files environment.prod.ts
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

---

## 📝 Step 4: Update README.md with Setup Instructions

Add this section to your README.md:

```markdown
## 🔧 Environment Setup

1. **Copy template files:**
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.template.ts src/environments/environment.prod.ts
   ```

2. **Update with your credentials:**
   - Get Firebase config from [Firebase Console](https://console.firebase.google.com/)
   - Get Razorpay keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Set your WhatsApp business number

3. **Never commit these files!**
   - `environment.ts` and `environment.prod.ts` are in `.gitignore`
   - Only the `.template.ts` file should be committed
```

---

## 🔐 Step 5: Use GitHub Secrets for CI/CD

If you plan to use GitHub Actions for deployment:

### Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_APP_ID`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `WHATSAPP_BUSINESS_NUMBER`

### Create GitHub Action Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Create environment files
        run: |
          cat > src/environments/environment.prod.ts << EOF
          export const environment = {
            production: true,
            firebase: {
              apiKey: '${{ secrets.FIREBASE_API_KEY }}',
              authDomain: '${{ secrets.FIREBASE_PROJECT_ID }}.firebaseapp.com',
              projectId: '${{ secrets.FIREBASE_PROJECT_ID }}',
              storageBucket: '${{ secrets.FIREBASE_PROJECT_ID }}.appspot.com',
              messagingSenderId: '${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}',
              appId: '${{ secrets.FIREBASE_APP_ID }}'
            },
            razorpay: {
              keyId: '${{ secrets.RAZORPAY_KEY_ID }}',
              keySecret: '${{ secrets.RAZORPAY_KEY_SECRET }}'
            },
            whatsapp: {
              businessNumber: '${{ secrets.WHATSAPP_BUSINESS_NUMBER }}',
              defaultMessage: 'Hello, I want to place an order'
            }
          };
          EOF
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

---

## ✅ Step 6: Verification Checklist

After implementing the security measures:

- [ ] `.gitignore` updated with environment file exclusions
- [ ] Template file created (`environment.template.ts`)
- [ ] Real environment files removed from Git tracking
- [ ] Commit and push changes
- [ ] Verify on GitHub that environment files are not visible
- [ ] Test cloning the repo fresh to ensure setup works
- [ ] Document setup process in README.md
- [ ] GitHub Secrets configured (if using CI/CD)

---

## 🚨 If You've Already Exposed Real API Keys

### Immediate Actions Required:

1. **Firebase:**
   - Go to Firebase Console → Project Settings
   - Delete and regenerate API keys
   - Add application restrictions

2. **Razorpay:**
   - Go to Razorpay Dashboard → Settings → API Keys
   - Regenerate keys immediately
   - Enable IP whitelisting if possible

3. **GitHub:**
   - Remove all environment files from Git history
   - Force push the cleaned repository
   - Consider making repo private temporarily

---

## 🎯 Best Practices Moving Forward

### DO:
✅ Use `.gitignore` to exclude sensitive files  
✅ Use environment templates for documentation  
✅ Use GitHub Secrets for CI/CD  
✅ Regularly audit your repository for secrets  
✅ Use tools like `git-secrets` or `gitleaks`  

### DON'T:
❌ Never commit real API keys  
❌ Never hardcode credentials in code  
❌ Never share screenshots of environment files  
❌ Never commit `.env` files  
❌ Never push without checking what's staged  

---

## 🔍 Tools to Prevent Secret Leaks

### Install git-secrets (Prevents committing secrets)

```powershell
# Install git-secrets
git clone https://github.com/awslabs/git-secrets
cd git-secrets
./install.ps1

# Set up for your repo
cd d:\My\WhatsApp-Orders-Local-shop
git secrets --install
git secrets --register-aws
```

### Scan Repository for Secrets

```powershell
# Using gitleaks
# Install: https://github.com/gitleaks/gitleaks
gitleaks detect --source . --verbose

# Using TruffleHog
# Install: pip install trufflehog
trufflehog filesystem .
```

---

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Filter-Repo Documentation](https://github.com/newren/git-filter-repo)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [Razorpay Security Guide](https://razorpay.com/docs/security/)

---

## 🆘 Need Help?

If you've accidentally exposed real credentials:
1. Immediately regenerate all API keys
2. Follow the "Remove from Git History" section
3. Consider making your repository private
4. Monitor for unauthorized access

---

**Last Updated:** February 2026  
**Status:** ⚠️ Action Required - Secure your repository before adding real credentials!
