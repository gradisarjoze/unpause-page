import { test } from "node:test";
import assert from "node:assert/strict";
import { publicUrl } from "./publicUrl.mjs";
import { SITE, PAGES } from "./site.mjs";

const site = "https://getunpause.com";

test("home from index.html and slash variants", () => {
  assert.equal(publicUrl(site, "/"), "https://getunpause.com/");
  assert.equal(publicUrl(site, "/index.html"), "https://getunpause.com/");
  assert.equal(publicUrl(site, "/index"), "https://getunpause.com/");
  assert.equal(publicUrl(site, "index.html"), "https://getunpause.com/");
});

test("inner pages drop .html and trailing slash", () => {
  assert.equal(publicUrl(site, "/how-it-works.html"), "https://getunpause.com/how-it-works");
  assert.equal(publicUrl(site, "/how-it-works/"), "https://getunpause.com/how-it-works");
  assert.equal(publicUrl(site, "/pricing.html"), "https://getunpause.com/pricing");
  assert.equal(publicUrl(site, "/support.html"), "https://getunpause.com/support");
  assert.equal(publicUrl(site, "/privacy.html"), "https://getunpause.com/privacy");
  assert.equal(publicUrl(site, "/terms.html"), "https://getunpause.com/terms");
});

test("absolute .html self-URLs normalize", () => {
  assert.equal(
    publicUrl(site, "https://getunpause.com/index.html"),
    "https://getunpause.com/",
  );
  assert.equal(
    publicUrl(site, "https://getunpause.com/how-it-works.html"),
    "https://getunpause.com/how-it-works",
  );
});

test("this repo's page map matches live clean URLs", () => {
  assert.equal(SITE, "https://getunpause.com");
  assert.equal(publicUrl(SITE, PAGES["index.html"]), "https://getunpause.com/");
  assert.equal(publicUrl(SITE, PAGES["support.html"]), "https://getunpause.com/support");
  assert.equal(publicUrl(SITE, PAGES["privacy-policy.html"]), "https://getunpause.com/privacy");
});
