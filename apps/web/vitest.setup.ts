import React from 'react'
import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/test',
}))

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<any>) => {
    const Component = () => React.createElement('div', null, 'Dynamic Component')
    Component.displayName = 'DynamicComponent'
    return Component
  },
}))