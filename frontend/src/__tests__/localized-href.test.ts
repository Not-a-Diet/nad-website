import { localizedHref } from "@/app/[lang]/utils/links";

describe("localizedHref", () => {
  // ── null / empty ──────────────────────────────────────────────────────────

  it("returns locale home for null", () => {
    expect(localizedHref(null, "en")).toBe("/en");
    expect(localizedHref(null, "it")).toBe("/it");
  });

  it("returns locale home for undefined", () => {
    expect(localizedHref(undefined, "en")).toBe("/en");
  });

  it("returns locale home for empty string", () => {
    expect(localizedHref("", "en")).toBe("/en");
  });

  // ── root and /home aliases ─────────────────────────────────────────────────

  it("converts '/' to locale home", () => {
    expect(localizedHref("/", "en")).toBe("/en");
    expect(localizedHref("/", "it")).toBe("/it");
    expect(localizedHref("/", "pt")).toBe("/pt");
  });

  it("converts '/home' to locale home", () => {
    expect(localizedHref("/home", "en")).toBe("/en");
    expect(localizedHref("/home", "it")).toBe("/it");
    expect(localizedHref("/home", "pt")).toBe("/pt");
  });

  // ── unlocalized internal paths ─────────────────────────────────────────────

  it("prefixes unlocalized /blog", () => {
    expect(localizedHref("/blog", "en")).toBe("/en/blog");
    expect(localizedHref("/blog", "it")).toBe("/it/blog");
  });

  it("prefixes unlocalized /pricing", () => {
    expect(localizedHref("/pricing", "it")).toBe("/it/pricing");
    expect(localizedHref("/pricing", "pt")).toBe("/pt/pricing");
  });

  it("prefixes unlocalized legal paths", () => {
    expect(localizedHref("/privacy-policy", "pt")).toBe("/pt/privacy-policy");
    expect(localizedHref("/cookie-policy", "it")).toBe("/it/cookie-policy");
    expect(localizedHref("/terms", "en")).toBe("/en/terms");
  });

  it("prefixes nested unlocalized paths", () => {
    expect(localizedHref("/blog/food/some-article", "en")).toBe(
      "/en/blog/food/some-article",
    );
  });

  // ── already locale-prefixed ────────────────────────────────────────────────

  it("leaves /en/… unchanged regardless of active lang", () => {
    expect(localizedHref("/en/blog", "it")).toBe("/en/blog");
    expect(localizedHref("/en/pricing", "pt")).toBe("/en/pricing");
  });

  it("leaves /it/… unchanged", () => {
    expect(localizedHref("/it/cookie-policy", "en")).toBe("/it/cookie-policy");
  });

  it("leaves /pt/… unchanged", () => {
    expect(localizedHref("/pt/terms", "en")).toBe("/pt/terms");
  });

  it("leaves bare locale roots unchanged", () => {
    expect(localizedHref("/en", "it")).toBe("/en");
    expect(localizedHref("/it", "en")).toBe("/it");
  });

  // ── hash anchors ──────────────────────────────────────────────────────────

  it("leaves hash anchors unchanged", () => {
    expect(localizedHref("#contact", "en")).toBe("#contact");
    expect(localizedHref("#section", "it")).toBe("#section");
    expect(localizedHref("#", "pt")).toBe("#");
  });

  // ── external URLs ──────────────────────────────────────────────────────────

  it("leaves https:// URLs unchanged", () => {
    expect(localizedHref("https://youtube.com/@NotADietLife", "en")).toBe(
      "https://youtube.com/@NotADietLife",
    );
  });

  it("leaves http:// URLs unchanged", () => {
    expect(localizedHref("http://example.com/path", "it")).toBe(
      "http://example.com/path",
    );
  });

  it("leaves mailto: unchanged", () => {
    expect(localizedHref("mailto:info@notadiet.life", "en")).toBe(
      "mailto:info@notadiet.life",
    );
  });

  it("leaves tel: unchanged", () => {
    expect(localizedHref("tel:+39351651206", "pt")).toBe("tel:+39351651206");
  });

  it("leaves // protocol-relative URLs unchanged", () => {
    expect(localizedHref("//cdn.example.com/asset.js", "en")).toBe(
      "//cdn.example.com/asset.js",
    );
  });

  // ── double-slash collapse ──────────────────────────────────────────────────

  it("collapses accidental double-slashes in the result", () => {
    // Simulate a CMS URL that already starts with '//something' but is not
    // external — after prefix it would produce '///'; the replace cleans it.
    // In practice this is rare but guard against it.
    expect(localizedHref("/blog//food", "en")).toBe("/en/blog/food");
  });
});
