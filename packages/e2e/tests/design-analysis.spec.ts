import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

test.describe('Design Analysis', () => {
  test('analyze homepage design', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Create screenshots directory
    const screenshotDir = path.join(process.cwd(), 'design-analysis');
    await fs.mkdir(screenshotDir, { recursive: true });
    
    // Take screenshots
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-full.png'),
      fullPage: true 
    });
    
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-viewport.png')
    });
    
    // Analyze navbar design
    const navbar = page.locator('header').first();
    const navbarVisible = await navbar.isVisible();
    expect(navbarVisible).toBe(true);
    
    // Check navbar height and styling
    const navbarBox = await navbar.boundingBox();
    console.log('Navbar dimensions:', navbarBox);
    
    // Get computed styles
    const navbarStyles = await navbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        height: el.offsetHeight,
        backgroundColor: computed.backgroundColor,
        borderBottom: computed.borderBottom,
        position: computed.position,
        padding: computed.padding
      };
    });
    console.log('Navbar styles:', navbarStyles);
    
    // Check logo
    const logo = page.locator('header img').first();
    if (await logo.isVisible()) {
      const logoBox = await logo.boundingBox();
      console.log('Logo dimensions:', logoBox);
    }
    
    // Check hero section
    const hero = page.locator('section#hero');
    if (await hero.isVisible()) {
      const heroStyles = await hero.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const bgImage = computed.backgroundImage;
        return {
          height: el.offsetHeight,
          padding: computed.padding,
          backgroundColor: computed.backgroundColor,
          backgroundImage: bgImage,
          hasBackgroundImage: bgImage !== 'none'
        };
      });
      console.log('Hero styles:', heroStyles);
      
      // Check hero text visibility
      const heroHeading = hero.locator('h1').first();
      const headingStyles = await heroHeading.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          color: computed.color,
          lineHeight: computed.lineHeight,
          marginBottom: computed.marginBottom
        };
      });
      console.log('Hero heading styles:', headingStyles);
    }
    
    // Check buttons for consistency
    const buttons = page.locator('button, a[class*="button"], a[class*="btn"]');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons`);
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const buttonStyles = await firstButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          height: el.offsetHeight,
          padding: computed.padding,
          borderRadius: computed.borderRadius,
          fontSize: computed.fontSize,
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      console.log('First button styles:', buttonStyles);
    }
    
    // Check spacing between sections
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    console.log(`Found ${sectionCount} sections`);
    
    const sectionSpacing = [];
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i);
      const box = await section.boundingBox();
      const id = await section.getAttribute('id');
      const styles = await section.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          marginTop: computed.marginTop,
          marginBottom: computed.marginBottom,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom
        };
      });
      sectionSpacing.push({ id, box, styles });
    }
    console.log('Section spacing:', sectionSpacing);
    
    // Check dark mode
    await page.click('button[aria-label="Toggle theme"]');
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-dark.png')
    });
    
    // Check mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-mobile.png'),
      fullPage: true
    });
    
    console.log(`\nScreenshots saved to: ${screenshotDir}`);
  });
});