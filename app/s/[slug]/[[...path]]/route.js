import { supabaseServer, BUCKET } from '../../../../lib/supabaseServer';

const MIME = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

function mimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

export async function GET(request, { params }) {
  try {
    const { slug, path } = params;
    const file = path?.length ? path.join('/') : 'index.html';

    const supabase = supabaseServer();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(`${slug}/${file}`);

    if (error || !data) {
      return new Response('Not found', { status: 404 });
    }

    const bytes = await data.arrayBuffer();
    return new Response(bytes, {
      headers: { 'Content-Type': mimeType(file) },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
