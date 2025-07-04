import { describe, it, expect } from 'vitest';

describe('Frontend Pages Smoke Tests', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  async function checkPageForErrors(url: string): Promise<{
    status: number;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Check for React errors
      if (html.includes('Error:')) {
        const errorMatch = html.match(/Error:\s*([^<]+)/);
        if (errorMatch) errors.push(`React Error: ${errorMatch[1]}`);
      }
      
      // Check for Runtime Error in Next.js error overlay
      if (html.includes('Runtime Error')) {
        const runtimeErrorMatch = html.match(/Runtime Error[^<]*Error:\s*([^<]+)/);
        if (runtimeErrorMatch) errors.push(`Runtime Error: ${runtimeErrorMatch[1]}`);
      }
      
      if (html.includes('React.Children.only')) {
        errors.push('React.Children.only error detected');
      }
      
      if (html.includes('Unhandled Runtime Error')) {
        errors.push('Unhandled Runtime Error detected');
      }
      
      if (html.includes('An error occurred during hydration')) {
        errors.push('Hydration error detected');
      }
      
      // Check for Next.js error overlay
      if (html.includes('__next-error')) {
        errors.push('Next.js error overlay detected');
      }
      
      // Check for console errors in the HTML
      if (html.includes('console.error')) {
        warnings.push('Console errors detected in HTML');
      }
      
      return {
        status: response.status,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        status: 0,
        errors: [`Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
      };
    }
  }

  it('should load homepage without errors', async () => {
    const result = await checkPageForErrors(baseUrl);
    
    if (result.errors.length > 0) {
      console.error('Homepage errors:', result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn('Homepage warnings:', result.warnings);
    }
    
    expect(result.status).toBe(200);
    expect(result.errors).toHaveLength(0);
  });

  it('should load blog page without errors', async () => {
    const result = await checkPageForErrors(`${baseUrl}/blog`);
    
    if (result.errors.length > 0) {
      console.error('Blog page errors:', result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn('Blog page warnings:', result.warnings);
    }
    
    expect(result.status).toBe(200);
    expect(result.errors).toHaveLength(0);
  });

  it('should have working API health endpoint', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});