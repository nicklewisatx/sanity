import { describe, it, expect } from 'vitest'
import { blog } from './blog'

describe('Blog Schema', () => {
  it('should have correct type and name', () => {
    expect(blog.type).toBe('document')
    expect(blog.name).toBe('blog')
    expect(blog.title).toBe('Blog')
  })

  it('should have required fields', () => {
    const fieldNames = blog.fields.map(f => f.name)
    
    // Essential fields
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('authors')
    expect(fieldNames).toContain('richText')
    expect(fieldNames).toContain('publishedAt')
    expect(fieldNames).toContain('image')
  })

  it('should have proper field validations', () => {
    const titleField = blog.fields.find(f => f.name === 'title')
    const slugField = blog.fields.find(f => f.name === 'slug')
    
    // Title should be required
    expect(titleField?.validation).toBeDefined()
    
    // Slug should be required
    expect(slugField?.validation).toBeDefined()
  })
})