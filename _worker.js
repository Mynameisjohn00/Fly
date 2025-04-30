export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Determine the file path based on the URL
    let path = url.pathname;
    
    // Handle root path
    if (path === '/' || path === '') {
      path = '/index.html';
    }
    
    // Handle direct page routes
    if (path === '/about') {
      path = '/about/about.html';
    } else if (path === '/shop') {
      path = '/shop/shop.html';
    } else if (path === '/blog') {
      path = '/blog/blog.html';
    } else if (path === '/rods') {
      path = '/rods/rods.html';
    }
    
    // Try to serve the file from the static assets
    try {
      return await env.ASSETS.fetch(new Request(url.origin + path, request));
    } catch (e) {
      // If file not found, return 404
      return new Response('Not Found', { status: 404 });
    }
  }
}; 