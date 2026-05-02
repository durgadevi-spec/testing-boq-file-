import { query } from './server/db/client.js';

async function check() {
  try {
    const res = await query('SELECT id, image_url FROM sketch_plan_images LIMIT 1');
    if (res.rows.length > 0) {
      const img = res.rows[0];
      console.log('ID:', img.id);
      console.log('URL Prefix:', img.image_url ? img.image_url.substring(0, 50) : 'null');
      
      const dataUrl = img.image_url;
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      console.log('Matches regex:', !!matches);
      if (matches) {
          console.log('Content Type:', matches[1]);
          console.log('Base64 Length:', matches[2].length);
      }
    } else {
      console.log('No images found');
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

check();
