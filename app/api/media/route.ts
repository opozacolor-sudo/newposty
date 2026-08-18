import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { presignMedia } from "@/lib/zernio";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  const isVideo = contentType.startsWith("video/");
  const { uploadUrl, publicUrl } = await presignMedia(file.name, contentType);

  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: buffer,
  });

  if (!upload.ok) {
    return NextResponse.json({ error: "Media upload failed" }, { status: 502 });
  }

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  await supabase.storage.from("media").upload(path, buffer, {
    contentType,
    upsert: false,
  });

  return NextResponse.json({
    url: publicUrl,
    type: isVideo ? "video" : "image",
    name: file.name,
  });
}
