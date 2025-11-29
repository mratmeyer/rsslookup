const UMAMI_COLLECT_URL = 'https://cloud.umami.is/api/send';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(UMAMI_COLLECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error proxying to Umami:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

