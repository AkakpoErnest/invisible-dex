/**
 * Vercel Serverless Function to proxy Polymarket API requests
 * This avoids CORS issues by making the request server-side
 * 
 * Usage: /api/polymarket?endpoint=events&active=true&closed=false&limit=5
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get endpoint from query (default to 'events')
  const { endpoint = 'events', ...queryParams } = req.query;
  
  // Build query string from remaining params
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    params.append(key, value);
  }
  
  const queryString = params.toString();
  const url = `https://gamma-api.polymarket.com/${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Polymarket API error', 
        status: response.status 
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch from Polymarket API', 
      message: error.message 
    });
  }
}
