import { vi } from 'vitest'

export interface MockSanityClient {
  fetch: ReturnType<typeof vi.fn>
  config: () => {
    projectId: string
    dataset: string
    apiVersion: string
    useCdn: boolean
    token?: string
    perspective?: string
    stega?: {
      enabled: boolean
      studioUrl?: string
    }
  }
}

export function createMockSanityClient(overrides?: Partial<MockSanityClient['config']>): MockSanityClient {
  const mockFetch = vi.fn()
  
  return {
    fetch: mockFetch,
    config: () => ({
      projectId: 'test-project',
      dataset: 'test-dataset',
      apiVersion: '2024-01-01',
      useCdn: false,
      ...overrides
    })
  }
}

export function mockDraftMode(isEnabled = false) {
  return vi.fn(() => ({ isEnabled }))
}

export const mockSanityData = {
  page: {
    _id: 'page-1',
    _type: 'page',
    title: 'Test Page',
    slug: { current: 'test-page' },
    seoDescription: 'Test description',
    pageBuilder: []
  },
  homePage: {
    _id: 'homePage',
    _type: 'homePage',
    title: 'Home',
    seoDescription: 'Home page description',
    pageBuilder: []
  },
  blog: {
    _id: 'blog-1',
    _type: 'blog',
    title: 'Test Blog Post',
    slug: { current: 'test-blog' },
    excerpt: 'Test excerpt',
    publishedAt: '2024-01-01',
    authors: [],
    categories: [],
    richText: []
  }
}