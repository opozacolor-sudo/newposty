import assert from "node:assert/strict";
import test from "node:test";
import { firstPublicUrlInText, parseSiteHtml, publicHttpUrl } from "./site-brief";

test("publicHttpUrl rejects private and non-http targets", () => {
  assert.equal(publicHttpUrl("https://posty.now"), "https://posty.now/");
  assert.equal(publicHttpUrl("http://127.0.0.1/x"), null);
  assert.equal(publicHttpUrl("https://192.168.1.9"), null);
  assert.equal(publicHttpUrl("file:///etc/passwd"), null);
});

test("parseSiteHtml reads Open Graph fields", () => {
  const brief = parseSiteHtml(
    `<html><head>
      <title>Ignore</title>
      <meta property="og:title" content="Posty" />
      <meta property="og:description" content="Studio for social posts." />
      <meta property="og:image" content="/og.jpg" />
    </head></html>`,
    "https://posty.now/ro",
  );
  assert.equal(brief.title, "Posty");
  assert.equal(brief.description, "Studio for social posts.");
  assert.equal(brief.imageUrl, "https://posty.now/og.jpg");
});

test("parseSiteHtml reads a product price", () => {
  const brief = parseSiteHtml(
    `<html><head>
      <meta property="og:title" content="Lampa de birou" />
      <meta property="product:price:amount" content="189" />
      <meta property="product:price:currency" content="RON" />
    </head></html>`,
    "https://shop.example/produs/lampa",
  );
  assert.equal(brief.title, "Lampa de birou");
  assert.equal(brief.price, "189 RON");
});

test("firstPublicUrlInText picks a product link from a chat line", () => {
  assert.equal(
    firstPublicUrlInText("uite produsul https://shop.ro/p/lampa?ref=1, fă poster"),
    "https://shop.ro/p/lampa?ref=1",
  );
});
