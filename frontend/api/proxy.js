// Vercel Serverless Function to proxy requests to ngrok and bypass the warning page
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const searchParams = url.searchParams;

    const service = searchParams.get('service');
    const path = searchParams.get('path');

    if (!service || !path) {
      return res.status(400).json({ error: 'Missing service or path parameter' });
    }

    const ngrokBase = 'https://ccdfbd60f6ba.ngrok-free.app';
    const targetUrl = `${ngrokBase}/${service}${path}`;

    console.log('Proxying request to:', targetUrl);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    // Set the same headers as the original response
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');

    // Try to parse as JSON, otherwise return as text
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json(jsonData);
    } catch {
      return res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
