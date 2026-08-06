import { supabaseServer, BUCKET } from '../../../lib/supabaseServer';

const WORDS = ['still-water', 'dry-leaf', 'low-tide', 'soft-glass', 'cold-iron', 'far-signal'];

function randomSlug() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const suffix = Math.random().toString(16).slice(2, 6);
  return `${word}-${suffix}`;
}

export async function POST(request) {
  try {
    // Validate request
    if (!request.body) {
      return Response.json({ error: 'Request body is empty' }, { status: 400 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files were uploaded' }, { status: 400 });
    }

    // Validate each file
    for (const file of files) {
      if (!file || !(file instanceof File)) {
        return Response.json({ error: 'Invalid file format' }, { status: 400 });
      }
      if (file.size === 0) {
        return Response.json({ error: `File "${file.name}" is empty` }, { status: 400 });
      }
    }

    const slug = randomSlug();

    try {
      const supabase = supabaseServer();

      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const path = file.webkitRelativePath || file.name;

        if (!path) {
          return Response.json({ error: 'File path is invalid' }, { status: 400 });
        }

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(`${slug}/${path}`, bytes, { upsert: true });

        if (error) {
          console.error('Upload error:', error);
          return Response.json(
            { error: `Failed to upload "${file.name}": ${error.message}` },
            { status: 500 }
          );
        }
      }

      return Response.json({ slug }, { status: 200 });
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return Response.json(
        { error: `Supabase error: ${supabaseError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Deploy error:', error);
    return Response.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
