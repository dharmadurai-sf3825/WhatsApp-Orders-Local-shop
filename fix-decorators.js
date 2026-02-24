const fs = require('fs');
const path = require('path');

const files = [
  'src/app/features/customer/cart/cart.component.ts',
  'src/app/features/customer/products/products.component.ts',
  'src/app/features/customer/home/home.component.ts',
  'src/app/features/customer/product-details/product-details.component.ts',
  'src/app/features/seller/orders-management/orders-management.component.ts',
  'src/app/features/seller/dashboard/dashboard.component.ts',
  'src/app/features/seller/products-management/products-management.component.ts',
  'src/app/features/seller/login/seller-login.component.ts'
];

function fixComponent(filePath) {
  const fullPath = path.join(__dirname, filePath);
  console.log(`\nProcessing: ${filePath}`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Get component name from file path
  const componentName = path.basename(filePath, '.ts');
  const htmlFile = `./${componentName}.html`;
  const scssFile = `./${componentName}.scss`;
  
  // Remove inline template (everything between template: ` and `,)
  const templateRegex = /template:\s*`[\s\S]*?`,?\s*/;
  if (templateRegex.test(content)) {
    content = content.replace(templateRegex, `templateUrl: '${htmlFile}',\n  `);
    console.log(`  ✓ Replaced template with templateUrl`);
  } else {
    console.log(`  ⚠ No inline template found`);
  }
  
  // Remove inline styles (everything between styles: [` and `])
  const stylesRegex = /styles:\s*\[`[\s\S]*?`\]/;
  if (stylesRegex.test(content)) {
    content = content.replace(stylesRegex, `styleUrl: '${scssFile}'`);
    console.log(`  ✓ Replaced styles with styleUrl`);
  } else {
    console.log(`  ⚠ No inline styles found`);
  }
  
  // Write back
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Updated ${componentName}`);
}

console.log('🔧 Fixing component decorators...\n');

files.forEach(fixComponent);

console.log('\n✅ All files processed!');
console.log('\nVerify the changes and test the application.');
