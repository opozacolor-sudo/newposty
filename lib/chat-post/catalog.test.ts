import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogCaption,
  parseCatalogRequest,
  pickCatalogTargets,
  scoreProductUrl,
} from "./catalog";

test("catalog brief asks for 30 daily product photos", () => {
  const plan = parseCatalogRequest({
    brief: "uite site-ul https://shop.example alege 30 de produse, creaza 30 de poze si programeaza cate una pe zi. pune link-ul site-ului in descriere",
  });
  assert.ok(plan);
  assert.equal(plan?.count, 30);
  assert.equal(plan?.siteUrl, "https://shop.example/");
  assert.equal(plan?.includeLink, true);
});

test("catalog captions include the product link", () => {
  const caption = catalogCaption({
    locale: "ro",
    siteUrl: "https://shop.example/",
    includeLink: true,
    product: {
      name: "Cremă de noapte",
      url: "https://shop.example/crema",
      imageUrl: null,
      price: "89 RON",
      description: "Aplică seara.",
    },
  });
  assert.match(caption, /Cremă de noapte/);
  assert.match(caption, /89 RON/);
  assert.match(caption, /https:\/\/shop.example\/crema/);
});

test("catalog picker prefers product URLs and skips cart", () => {
  const picked = pickCatalogTargets("https://shop.example/", [
    "https://shop.example/cart",
    "https://shop.example/products/crema",
    "https://shop.example/about",
    "https://shop.example/product/serum",
  ], 3);
  assert.ok(picked.includes("https://shop.example/products/crema"));
  assert.ok(picked.includes("https://shop.example/product/serum"));
  assert.ok(!picked.includes("https://shop.example/cart"));
  assert.ok(scoreProductUrl("https://shop.example/cart") < 0);
});
