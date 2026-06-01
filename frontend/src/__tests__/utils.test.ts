import '@testing-library/jest-dom'
import { fetchAPI } from '@/app/[lang]/utils/fetch-api'

beforeEach(() => {
  jest.resetModules()
})

describe('fetchAPI', () => {
  it('builds URL with correct path', async () => {
    let capturedUrl = ''
    global.fetch = jest.fn((url) => {
      capturedUrl = url.toString()
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) } as Response)
    })

    await fetchAPI('/articles')

    expect(capturedUrl).toContain('/api/articles')
  })

  it('converts dot-notation populate array to nested v5 objects', async () => {
    let capturedUrl = ''
    global.fetch = jest.fn((url) => {
      capturedUrl = url.toString()
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) } as Response)
    })

    await fetchAPI('/test', { populate: ['metadata.shareImage', 'navbar'] })

    const decoded = decodeURIComponent(capturedUrl)
    expect(decoded).toContain('populate[metadata][populate][shareImage]=true')
    expect(decoded).toContain('populate[navbar]=true')
  })

  it('passes object populate through unchanged', async () => {
    let capturedUrl = ''
    global.fetch = jest.fn((url) => {
      capturedUrl = url.toString()
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) } as Response)
    })

    await fetchAPI('/test', { populate: { cover: true } })

    const decoded = decodeURIComponent(capturedUrl)
    expect(decoded).toContain('populate[cover]=true')
  })

  it('passes string populate ("*") through unchanged', async () => {
    let capturedUrl = ''
    global.fetch = jest.fn((url) => {
      capturedUrl = url.toString()
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) } as Response)
    })

    await fetchAPI('/test', { populate: '*' })

    const decoded = decodeURIComponent(capturedUrl)
    expect(decoded).toContain('populate=*')
  })

  it('returns data from successful response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: 'Hello' }], meta: {} }),
      } as Response)
    )

    const result = await fetchAPI('/articles')

    expect(result.data).toHaveLength(1)
    expect(result.data[0].title).toBe('Hello')
  })

  it('throws on Strapi error in response body', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ error: { message: 'Not found' } }),
      } as Response)
    )

    await expect(fetchAPI('/missing')).rejects.toThrow('Strapi API error: Not found')
  })

  it('wraps network failure as server-check error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

    await expect(fetchAPI('/test')).rejects.toThrow(
      'Please check if your server is running'
    )
  })

  it('appends query string params to URL', async () => {
    let capturedUrl = ''
    global.fetch = jest.fn((url) => {
      capturedUrl = url.toString()
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) } as Response)
    })

    await fetchAPI('/articles', { sort: { createdAt: 'desc' }, pagination: { start: 0, limit: 6 } })

    const decoded = decodeURIComponent(capturedUrl)
    expect(decoded).toContain('sort[createdAt]=desc')
    expect(decoded).toContain('pagination[start]=0')
    expect(decoded).toContain('pagination[limit]=6')
  })
})
