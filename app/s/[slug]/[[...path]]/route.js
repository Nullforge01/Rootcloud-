import { supabaseServer, BUCKET } from '../../../../lib/supabaseServer';
import { notFoundPage } from '../../../../lib/notFoundPage';

const MIME_TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  txt: 'text/plain; charset=utf-8',
};

function contentTypeFor(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export async function GET(request, { params }) {
  const { slug, path } = params;
  // No sub-path -> serve index.html by default (like any static host)
  const filePath = path && path.length ? path.join('/') : 'index.html';

  const supabase = supabaseServer();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(`${slug}/${filePath}`);

  if (error || !data) {
    const html = notFoundPage({ slug, missingFile: filePath });
    return new Response(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const bytes = await data.arrayBuffer();
  return new Response(bytes, {
    headers: { 'Content-Type': contentTypeFor(filePath) },
  });
  
