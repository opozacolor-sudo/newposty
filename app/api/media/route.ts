import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 60;

const MAX_BYTES = 100 * 1024 * 1024;

function safeFilename(name: string) {
  const base = name.split(/[/\\]/).pop()?.trim() || "file";
  return base.replace(/[^\w.\-()+]+/g, "_").slice(0, 120) || "file";
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const header = request.headers.get("content-type") ?? "";
    if (header.includes("application/json")) {
      const body = (await request.json()) as {
        action?: string;
        filename?: string;
        contentType?: string;
        size?: number;
        path?: string;
        name?: string;
        type?: "image" | "video";
      };

      if (body.action === "prepare") {
        if (typeof body.size === "number" && body.size > MAX_BYTES) {
          return NextResponse.json(
            { error: "file_too_large", code: "file_too_large" },
            { status: 413 },
          );
        }
        const filename = safeFilename(body.filename ?? "file");
        const path = `${user.id}/${crypto.randomUUID()}-${filename}`;
        const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(path);
        if (error || !data?.signedUrl) {
          return NextResponse.json(
            { error: error?.message ?? "Could not start upload." },
            { status: 500 },
          );
        }
        return NextResponse.json({
          signedUrl: data.signedUrl,
          path: data.path ?? path,
          token: data.token,
        });
      }

      if (body.action === "complete") {
        const path = String(body.path ?? "");
        if (!path.startsWith(`${user.id}/`)) {
          return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
        }
        const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
        const isVideo = body.type === "video";
        const { data: mediaRow, error } = await supabase
          .from("conversation_media")
          .insert({
            user_id: user.id,
            url: publicData.publicUrl,
            type: isVideo ? "video" : "image",
            name: body.name ?? path.split("/").pop() ?? "file",
          })
          .select("id, url, type, name")
          .single();
        if (error || !mediaRow) {
          return NextResponse.json({
            id: crypto.randomUUID(),
            url: publicData.publicUrl,
            type: isVideo ? "video" : "image",
            name: body.name ?? "file",
          });
        }
        return NextResponse.json(mediaRow);
      }

      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "file_too_large", code: "file_too_large" }, { status: 413 });
    }

    const contentType = file.type || "application/octet-stream";
    const isVideo = contentType.startsWith("video/");
    const path = `${user.id}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("media").upload(path, buffer, {
      contentType,
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 502 });
    }
    const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
    const { data: mediaRow, error } = await supabase
      .from("conversation_media")
      .insert({
        user_id: user.id,
        url: publicData.publicUrl,
        type: isVideo ? "video" : "image",
        name: file.name,
      })
      .select("id, url, type, name")
      .single();
    if (error || !mediaRow) {
      return NextResponse.json({
        id: crypto.randomUUID(),
        url: publicData.publicUrl,
        type: isVideo ? "video" : "image",
        name: file.name,
      });
    }
    return NextResponse.json(mediaRow);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
