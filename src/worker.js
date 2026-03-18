import { serveAssets } from 'cloudflare:assets'

const ASSET_MANIFEST = await import("./__static-content-manifest", { assert: { type: "json" } })

export default {
  async fetch(request, env, ctx) {
    try {
      return await serveAssets(request, env)
    } catch (e) {
      // Handle 404s and serve custom 404 page
      if (e.code === "NOT_FOUND") {
        const modifiedRequest = new Request(`${new URL(request.url).origin}/404.html`, request)
        return await serveAssets(modifiedRequest, env)
      }
      return new Response(`Worker Error: ${e.message}`, { status: 500 })
    }
  },
}

export { serveAssets }