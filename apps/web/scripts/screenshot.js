const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('📸 Capturing homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Create directory
  const dir = path.join(process.cwd(), 'design-analysis');
  await fs.mkdir(dir, { recursive: true });
  
  // Take screenshots
  await page.screenshot({ path: path.join(dir, 'homepage.png'), fullPage: true });
  
  // Capture viewport only
  await page.screenshot({ path: path.join(dir, 'homepage-viewport.png') });
  
  // Dark mode
  await page.evaluate(() => {
    const button = document.querySelector('button[aria-label="Toggle theme"]');
    if (button) button.click();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(dir, 'homepage-dark.png') });
  
  // Mobile view
  await page.setViewport({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(dir, 'homepage-mobile.png'), fullPage: true });
  
  console.log('✅ Screenshots saved to design-analysis/');
  
  await browser.close();
}

captureScreenshots().catch(console.error);