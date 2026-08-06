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
  txt: 'text/plain; charset=utf-8',
};

function mimeType(filename) {
  if (!filename) return 'application/octet-stream';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return MIME[ext] || 'application/octet-stream';
}

function notFoundHtml(slug, file) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>404 - Site Not Found</title>
  <style>
    body { font-family: sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { background: white; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px; }
    h1 { margin: 0 0 10px; color: #333; }
    p { color: #666; margin: 0 0 20px; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
    a { color: #3D82F7; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404 — Not Found</h1>
    <p>Deploy <code>${slug}</code> doesn't have <code>${file}</code></p>
    <a href="/">← Back to rootcloud</a>
  </div>
</body>
</html>`;
}

export async function GET(request, { params }) {
  try {
    // Validate parameters
    if (!params || !params.slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    const { slug, path } = params;
    const file = path?.length ? path.join('/') : 'index.html';

    // Security: prevent path traversal
    if (file.includes('..') || file.startsWith('/')) {
      return new Response('Invalid file path', { status: 400 });
    }

    try {
      const supabase = supabaseServer();
      const fullPath = `${slug}/${file}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .download(fullPath);

      if (error || !data) {
        console.warn(`File not found: ${fullPath}`);
        const html = notFoundHtml(slug, file);
        return new Response(html, {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const bytes = await data.arrayBuffer();
      return new Response(bytes, {
        status: 200,
        headers: { 'Content-Type': mimeType(file) },
      });
    } catch (supabaseError) {
      console.error('Supabase download error:', supabaseError);
      return new Response(`Download failed: ${supabaseError.message}`, { status: 500 });
    }
  } catch (error) {
    console.error('Serve error:', error);
    return new Response(`Server error: ${error.message}`, { status: 500 });
  }
    }
