export function createMockRequest(options: {
  url?: string
  method?: string
  headers?: Record<string, string>
  searchParams?: Record<string, string>
  body?: any
} = {}): Request & { nextUrl: URL } {
  const {
    url = 'http://localhost:3000/api/test',
    method = 'GET',
    headers = {},
    searchParams = {},
    body
  } = options

  const urlWithParams = new URL(url)
  Object.entries(searchParams).forEach(([key, value]) => {
    urlWithParams.searchParams.set(key, value)
  })

  const request = new Request(urlWithParams.toString(), {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined
  }) as Request & { nextUrl: URL }
  
  // Add nextUrl property for Next.js compatibility
  request.nextUrl = urlWithParams

  return request
}

export async function extractResponseData(response: Response) {
  const contentType = response.headers.get('content-type')
  
  if (contentType?.includes('application/json')) {
    return await response.json()
  }
  
  return await response.text()
}