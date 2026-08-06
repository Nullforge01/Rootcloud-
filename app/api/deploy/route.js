import { supabaseServer, BUCKET } from '../../../lib/supabaseServer';

const WORDS = ['still-water', 'dry-leaf', 'low-tide', 'soft-glass', 'cold-iron', 'far-signal'];

function randomSlug() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const suffix = Math.random().toString(16).slice(2, 6);
  return `${word}-${suffix}`;
}

export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll('files');

  if (!files.length) {
    return Response.json({ error: 'No files were uploaded.' }, { status: 400 });
  }

  const slug = randomSlug();
  const supabase = supabaseServer();

  for (const file of files) {
    // file.webkitRelativePath (if a folder was dropped) preserves subfolders;
    // fall back to file.name for flat uploads.
    const relativePath = file.webkitRelativePath || file.name;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${slug}/${relativePath}`, bytes, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ slug });
}
