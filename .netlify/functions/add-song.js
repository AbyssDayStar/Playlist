import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { name, url, category, description } = JSON.parse(event.body);
    if (!name || !url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name and URL are required' }) };
    }

    const sql = neon(process.env.DATABASE_URL);
    await sql(
      'INSERT INTO songs (name, url, category, description) VALUES ($1, $2, $3, $4)',
      [name, url, category || null, description || null]
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}