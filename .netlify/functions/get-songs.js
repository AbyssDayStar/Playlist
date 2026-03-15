import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  // 允许跨域（开发时可使用，生产环境同域可省略）
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const sql = neon(process.env.DATABASE_URL);
    const songs = await sql('SELECT * FROM songs ORDER BY created_at DESC');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(songs),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}