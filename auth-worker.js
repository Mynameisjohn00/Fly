addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS(request)
  }

  // Handle actual request
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await request.json()
      
      // Get stored credentials from KV namespace
      const storedUsername = await AUTH_CREDENTIALS.get('admin_username')
      const storedPassword = await AUTH_CREDENTIALS.get('admin_password')
      
      // Compare credentials
      if (data.username === storedUsername && data.password === storedPassword) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Authentication successful' 
        }), {
          headers: corsHeaders('application/json')
        })
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid username or password' 
        }), {
          status: 401,
          headers: corsHeaders('application/json')
        })
      }
    }
  }

  // Handle other requests
  return new Response('Method not allowed', { status: 405 })
}

function corsHeaders(contentType) {
  return {
    'Content-Type': contentType || 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

function handleCORS() {
  return new Response(null, {
    headers: corsHeaders()
  })
} 