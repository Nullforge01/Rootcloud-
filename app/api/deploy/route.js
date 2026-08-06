import { supabaseServer, BUCKET } from '../../../lib/supabaseServer';

const WORDS = ['still-water', 'dry-leaf', 'low-tide', 'soft-glass', 'cold-iron', 'far-signal'];

function randomSlug() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const suffix = Math.random().toString(16).slice(2, 6);
  return `${word}-${suffix}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files.length) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const slug = randomSlug();
    const supabase = supabaseServer();

    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const path = file.webkitRelativePath || file.name;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(`${slug}/${path}`, bytes, { upsert: true });

      if (error) throw error;
    }

    return Response.json({ slug });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
