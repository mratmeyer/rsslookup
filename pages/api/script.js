const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
const UMAMI_ENDPOINT = 'https://cloud.umami.is';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(UMAMI_SCRIPT_URL);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch script' });
    }

    let script = await response.text();
    
    // Rewrite the Umami endpoint to use our proxy
    script = script.replace(
      new RegExp(UMAMI_ENDPOINT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      ''
    );

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.status(200).send(script);
  } catch (error) {
    console.error('Error fetching Umami script:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

