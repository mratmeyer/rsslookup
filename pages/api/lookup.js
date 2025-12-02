import { lookupFeeds } from '../../lib/actions.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 405,
      message: 'Only POST requests are accepted.',
    });
  }

  try {
    const { url, cloudflareToken } = req.body;

    const result = await lookupFeeds(url, cloudflareToken);

    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'An internal server error occurred.',
    });
  }
}

