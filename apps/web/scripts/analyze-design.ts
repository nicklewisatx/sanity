import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

async function analyzeDesign() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('📸 Capturing homepage design...');
  
  // Navigate to homepage
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take screenshots
  const screenshotDir = path.join(process.cwd(), 'design-analysis');
  await fs.mkdir(screenshotDir, { recursive: true });
  
  // Full page screenshot
  await page.screenshot({ 
    path: path.join(screenshotDir, 'homepage-full.png'),
    fullPage: true 
  });
  
  // Viewport screenshot
  await page.screenshot({ 
    path: path.join(screenshotDir, 'homepage-viewport.png')
  });
  
  // Analyze design elements
  console.log('\n🔍 Analyzing design elements...\n');
  
  // Check navbar
  const navbar = await page.locator('header').first();
  if (await navbar.isVisible()) {
    const navbarBox = await navbar.boundingBox();
    console.log('✓ Navbar found:', navbarBox);
    
    // Check navbar sticky behavior
    const navbarClasses = await navbar.getAttribute('class');
    console.log('  Navbar classes:', navbarClasses);
  }
  
  // Check hero section
  const heroSection = await page.locator('section#hero').first();
  if (await heroSection.isVisible()) {
    const heroBox = await heroSection.boundingBox();
    console.log('\n✓ Hero section found:', heroBox);
    
    // Check hero background
    const heroStyles = await heroSection.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage,
        color: computed.color,
        padding: computed.padding
      };
    });
    console.log('  Hero styles:', heroStyles);
  }
  
  // Check spacing and alignment
  const sections = await page.locator('section').all();
  console.log(`\n📏 Found ${sections.length} sections`);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const box = await section.boundingBox();
    const id = await section.getAttribute('id');
    console.log(`  Section ${i + 1} (${id || 'unnamed'}):`, box);
  }
  
  // Check buttons
  const buttons = await page.locator('button, a[class*="button"]').all();
  console.log(`\n🔘 Found ${buttons.length} buttons`);
  
  // Check typography
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  console.log(`\n📝 Found ${headings.length} headings`);
  
  for (let i = 0; i < Math.min(headings.length, 5); i++) {
    const heading = headings[i];
    const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
    const text = await heading.textContent();
    const styles = await heading.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        color: computed.color,
        marginBottom: computed.marginBottom
      };
    });
    console.log(`  ${tagName}: "${text?.substring(0, 50)}..."`, styles);
  }
  
  // Check dark mode
  await page.click('button[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  await page.screenshot({ 
    path: path.join(screenshotDir, 'homepage-dark.png')
  });
  
  console.log('\n✅ Design analysis complete!');
  console.log(`Screenshots saved to: ${screenshotDir}`);
  
  await browser.close();
}

analyzeDesign().catch(console.error);