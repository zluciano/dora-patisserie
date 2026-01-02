const fs = require('fs');
const path = require('path');

// Fix for Vercel deployment issue with route groups
// Creates empty manifest files that Vercel's build process expects

const routeGroups = ['(storefront)', '(admin)'];
const nextDir = path.join(process.cwd(), '.next', 'server', 'app');

routeGroups.forEach(group => {
  const groupDir = path.join(nextDir, group);
  if (fs.existsSync(groupDir)) {
    const manifestFile = path.join(groupDir, 'page_client-reference-manifest.js');
    if (!fs.existsSync(manifestFile)) {
      fs.writeFileSync(manifestFile, 'module.exports = {};');
      console.log(`Created ${manifestFile}`);
    }
  }
});

console.log('Vercel manifest fix complete');
