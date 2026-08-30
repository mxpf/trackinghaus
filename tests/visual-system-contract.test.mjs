import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = new URL("../src/styles.css", import.meta.url);
const app = new URL("../src/App.jsx", import.meta.url);
const footer = new URL("../src/SiteFooter.jsx", import.meta.url);
const pieceReading = new URL("../src/ReadingByPiece.jsx", import.meta.url);
const weeklyReading = new URL("../src/WeeklyReading.jsx", import.meta.url);

test("mirrors the Thinkinghaus two-column visual system and preserves mobile width", async () => {
  const css = await readFile(styles, "utf8");
  assert.match(css, /--blog-background:\s*#211f1a/);
  assert.match(css, /--blog-foreground:\s*#f1ede3/);
  assert.match(css, /--blog-muted:\s*#9a9285/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 38fr\) minmax\(0, 62fr\)/);
  assert.match(css, /\.site-footer\s*{[^}]*grid-template-columns:\s*minmax\(0, 38fr\) minmax\(0, 62fr\)/s);
  assert.match(css, /\.article-column\s*{[^}]*width:\s*62%;[^}]*max-inline-size:\s*none;/s);
  assert.match(css, /@media \(max-width: 767px\)\s*{[\s\S]*?\.article-column\s*{\s*width:\s*100%;/);
  assert.match(css, /\.is-index-page \.period h1\s*{\s*animation-delay: 20ms;/);
  assert.match(css, /\.is-index-page \.period p\s*{\s*animation-delay: 40ms;/);
  assert.match(css, /\.is-index-page \.site-footer\s*{\s*animation-delay: 140ms;/);
});

test("keeps article links light on hover and limits footer reveal to article pages", async () => {
  const [css, source] = await Promise.all([readFile(styles, "utf8"), readFile(footer, "utf8")]);
  assert.match(css, /\.article-body a:hover,[\s\S]*?color:\s*var\(--blog-foreground\);[\s\S]*?opacity:\s*1;/);
  assert.match(css, /\.inline-link:hover,[\s\S]*?color:\s*var\(--blog-foreground\);[\s\S]*?opacity:\s*1;/);
  assert.match(css, /--article-copy:\s*#ada59b/);
  assert.match(css, /\.inline-link,[\s\S]*?color:\s*var\(--article-copy\);/);
  assert.match(css, /a\s*{\s*color:\s*inherit;\s*text-decoration:\s*none;\s*transition:\s*opacity 160ms ease;/);
  assert.match(css, /a:hover,\s*a:focus-visible\s*{\s*opacity:\s*0\.48;/);
  assert.match(css, /\.is-article-page \.site-footer\.site-footer--end-reveal\.is-armed/);
  assert.match(css, /article-footer-reveal 220ms ease-out both/);
  assert.match(source, /window\.addEventListener\("scroll", revealAtScrollEnd, \{ passive: true \}\)/);
  assert.match(source, /window\.addEventListener\("resize", revealAtScrollEnd\)/);
  assert.match(source, /document\.documentElement\.scrollHeight - window\.innerHeight - window\.scrollY/);
});

test("uses real same-origin links for native cross-document navigation", async () => {
  const [css, appSource, pieceSource, weeklySource] = await Promise.all([
    readFile(styles, "utf8"),
    readFile(app, "utf8"),
    readFile(pieceReading, "utf8"),
    readFile(weeklyReading, "utf8"),
  ]);
  assert.match(css, /@view-transition\s*{\s*navigation:\s*auto;/);
  assert.match(appSource, /const piecesHref = locationForView\("pieces"\)/);
  assert.match(appSource, /const weekHref = locationForView\("week"\)/);
  assert.match(pieceSource, /href=\{weekHref\}/);
  assert.match(weeklySource, /href=\{piecesHref\}/);
  assert.doesNotMatch(appSource, /window\.history\.pushState/);
});

test("explains the week-over-week comparison in Reading by piece", async () => {
  const source = await readFile(pieceReading, "utf8");
  assert.match(source, /Change from last week/);
  assert.match(source, /aria-label=\{changeDescription\(item\.change\)\}/);
  assert.match(source, /reads === 1 \? "read" : "reads"/);
});
