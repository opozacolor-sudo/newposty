import { NextResponse } from "next/server";

function safePlatform(value: string) {
  return /^[a-z0-9_-]+$/i.test(value) ? value : "";
}

export async function GET(request: Request) {
  const platform = safePlatform(new URL(request.url).searchParams.get("platform") ?? "");
  const deepLink = `postynow://oauth-callback?platform=${encodeURIComponent(platform)}&connected=1`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>posty.now</title>
    <meta http-equiv="refresh" content="0;url=${deepLink}" />
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background: #fff; color: #1a1a1a; margin: 0; min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 24px; }
      a { color: #FF4713; }
    </style>
  </head>
  <body>
    <p>Returning to the Posty app…</p>
    <p><a href="${deepLink}">Open posty.now</a></p>
    <script>window.location.replace(${JSON.stringify(deepLink)});</script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
