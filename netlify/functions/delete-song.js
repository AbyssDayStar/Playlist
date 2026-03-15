import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing song id' }) };
    }

    const sql = neon(process.env.DATABASE_URL);
    await sql('DELETE FROM songs WHERE id = $1', [id]);

    return {
      statusCode: 200,
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