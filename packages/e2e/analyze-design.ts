import { chromium } from "@playwright/test";
import { writeFileSync } from "fs";

async function analyzeDesign() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const analysis = {
    timestamp: new Date().toISOString(),
    pages: {},
    components: {},
    designPatterns: {},
    improvements: [],
  };

  try {
    // Analyze homepage
    console.log("Analyzing homepage...");
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("section#hero", { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // Take screenshots
    await page.screenshot({ path: "screenshots/homepage-full.png", fullPage: true });
    await page.screenshot({ path: "screenshots/homepage-above-fold.png" });

    // Analyze hero section
    const heroAnalysis = await page.evaluate(() => {
      const hero = document.querySelector("section#hero");
      if (!hero) return null;

      const styles = window.getComputedStyle(hero);
      const heading = hero.querySelector("h1");
      const subtitle = hero.querySelector("p");
      const buttons = hero.querySelectorAll("button, a[role='button']");

      return {
        exists: true,
        height: hero.clientHeight,
        backgroundColor: styles.backgroundColor,
        textAlignment: styles.textAlign,
        heading: {
          text: heading?.textContent,
          fontSize: heading ? window.getComputedStyle(heading).fontSize : null,
          fontWeight: heading ? window.getComputedStyle(heading).fontWeight : null,
          color: heading ? window.getComputedStyle(heading).color : null,
        },
        subtitle: {
          text: subtitle?.textContent,
          fontSize: subtitle ? window.getComputedStyle(subtitle).fontSize : null,
          color: subtitle ? window.getComputedStyle(subtitle).color : null,
        },
        buttons: Array.from(buttons).map((btn) => {
          const btnStyles = window.getComputedStyle(btn);
          return {
            text: btn.textContent,
            backgroundColor: btnStyles.backgroundColor,
            color: btnStyles.color,
            padding: btnStyles.padding,
            borderRadius: btnStyles.borderRadius,
          };
        }),
      };
    });

    // Analyze navigation
    const navAnalysis = await page.evaluate(() => {
      const nav = document.querySelector("header");
      if (!nav) return null;

      const styles = window.getComputedStyle(nav);
      const logo = nav.querySelector("img");
      const navItems = nav.querySelectorAll("nav a, nav button");

      return {
        exists: true,
        height: nav.clientHeight,
        backgroundColor: styles.backgroundColor,
        borderBottom: styles.borderBottom,
        logo: {
          exists: !!logo,
          src: logo?.src,
          width: logo?.clientWidth,
          height: logo?.clientHeight,
        },
        navItems: Array.from(navItems).map((item) => ({
          text: item.textContent,
          href: (item as HTMLAnchorElement).href || null,
        })),
      };
    });

    // Analyze typography scale
    const typographyAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, a");
      const fontSizes = new Set<string>();
      const fontWeights = new Set<string>();
      const lineHeights = new Set<string>();
      const colors = new Set<string>();

      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        fontSizes.add(styles.fontSize);
        fontWeights.add(styles.fontWeight);
        lineHeights.add(styles.lineHeight);
        colors.add(styles.color);
      });

      return {
        fontSizes: Array.from(fontSizes).sort(),
        fontWeights: Array.from(fontWeights).sort(),
        lineHeights: Array.from(lineHeights).sort(),
        colors: Array.from(colors),
        fontFamily: window.getComputedStyle(document.body).fontFamily,
      };
    });

    // Analyze spacing patterns
    const spacingAnalysis = await page.evaluate(() => {
      const sections = document.querySelectorAll("section, div[class*='container']");
      const paddings = new Set<string>();
      const margins = new Set<string>();

      sections.forEach((section) => {
        const styles = window.getComputedStyle(section);
        paddings.add(styles.padding);
        margins.add(styles.margin);
      });

      return {
        paddings: Array.from(paddings),
        margins: Array.from(margins),
      };
    });

    // Analyze color palette
    const colorAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const backgrounds = new Set<string>();
      const textColors = new Set<string>();
      const borderColors = new Set<string>();

      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor !== "rgba(0, 0, 0, 0)") {
          backgrounds.add(styles.backgroundColor);
        }
        if (styles.color) {
          textColors.add(styles.color);
        }
        if (styles.borderColor && styles.borderColor !== "rgba(0, 0, 0, 0)") {
          borderColors.add(styles.borderColor);
        }
      });

      return {
        backgrounds: Array.from(backgrounds),
        textColors: Array.from(textColors),
        borderColors: Array.from(borderColors),
      };
    });

    // Store analysis results
    analysis.pages["homepage"] = {
      hero: heroAnalysis,
      navigation: navAnalysis,
      typography: typographyAnalysis,
      spacing: spacingAnalysis,
      colors: colorAnalysis,
    };

    // Analyze blog page
    console.log("Analyzing blog page...");
    await page.goto("http://localhost:3000/blog", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/blog-page.png", fullPage: true });

    // Generate improvement recommendations
    analysis.improvements = [
      {
        category: "Typography",
        priority: "high",
        recommendations: [
          "Establish a consistent type scale using a modular ratio (1.25 or 1.333)",
          "Limit font weights to 3-4 variations for better hierarchy",
          "Ensure consistent line-height ratios across text sizes",
        ],
      },
      {
        category: "Spacing",
        priority: "high",
        recommendations: [
          "Use a consistent spacing scale (8px baseline grid)",
          "Create spacing tokens for consistent vertical rhythm",
          "Implement section-level spacing patterns",
        ],
      },
      {
        category: "Color System",
        priority: "medium",
        recommendations: [
          "Define semantic color tokens (primary, secondary, accent)",
          "Ensure proper contrast ratios for accessibility (WCAG AA)",
          "Create systematic color variations for interactive states",
        ],
      },
      {
        category: "Component Patterns",
        priority: "high",
        recommendations: [
          "Extract reusable button variants with consistent sizing",
          "Create flexible card components with predictable layouts",
          "Implement responsive grid system with standard breakpoints",
        ],
      },
      {
        category: "Navigation",
        priority: "medium",
        recommendations: [
          "Add active state indicators for current page",
          "Implement consistent hover/focus states",
          "Consider sticky navigation for better UX",
        ],
      },
    ];

    // Save analysis
    writeFileSync(
      "design-analysis.json",
      JSON.stringify(analysis, null, 2)
    );

    console.log("Design analysis complete! Check design-analysis.json");

  } catch (error) {
    console.error("Error during analysis:", error);
  } finally {
    await browser.close();
  }
}

analyzeDesign().catch(console.error);