// Build pipeline for Studio Print frontend.
// Minifies HTML + inline JS/CSS via html-minifier-terser and optionally obfuscates
// inline scripts via javascript-obfuscator. Output goes to ./dist and is what
// Netlify (or any static host) should publish.

const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT = __dirname;
const SRC = ROOT;
const OUT = path.join(ROOT, 'dist');

const HTML_FILES = [
  'index.html',
  'passport-photo.html',
  'forms.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'refund.html',
  'shipping.html',
  'id-print.html',
  'id-print-regression.html',
  '404.html',
  'offline.html',
];

// Static asset folders to copy verbatim (CSS/fonts/images/security contact).
// We still minify CSS via html-minifier-terser when it appears inline in HTML;
// standalone CSS files are copied as-is because they are already small.
const ASSET_DIRS = ['assets', '.well-known'];

// Deploy-host config files that must land at the root of dist/ verbatim.
// `_headers` / `_redirects` are the Netlify-style conventions that Cloudflare
// Pages also honours, so the same files work for either host.
// `robots.txt` / `sitemap.xml` are copied so search engines can index the site.
const ROOT_FILES = ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'sw.js', 'favicon.ico'];

// Obfuscator options — conservative settings that preserve globals referenced
// by inline onclick="foo()" handlers. Renaming globals would break the app.
const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'mangled',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.5,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

const HTML_MINIFIER_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      passes: 2,
    },
    mangle: true,
    format: { comments: false },
  },
  minifyURLs: false,
};

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map((entry) => {
    const target = path.join(dir, entry.name);
    return fs.promises.rm(target, { recursive: true, force: true });
  }));
}

async function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  await ensureDir(dest);
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else {
      await fs.promises.copyFile(s, d);
    }
  }
}

// Extract inline <script> blocks (non-src, non-JSON, non-module), run them
// through javascript-obfuscator, and splice the result back into the HTML.
// html-minifier-terser will still run its terser pass on the (obfuscated) JS.
function obfuscateInlineScripts(html) {
  const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  return html.replace(SCRIPT_RE, (match, attrs, body) => {
    // skip external scripts and non-JS types (application/json, importmap, etc.)
    if (/\bsrc\s*=/.test(attrs)) return match;
    const typeMatch = attrs.match(/\btype\s*=\s*['"]?([^'"\s>]+)/i);
    if (typeMatch) {
      const t = typeMatch[1].toLowerCase();
      if (t && !/^(text\/|application\/)?(javascript|ecmascript)$/i.test(t) && t !== 'module') {
        return match; // e.g. application/json, importmap
      }
    }
    const trimmed = body.trim();
    if (!trimmed || trimmed.length < 1500) return match; // skip small utility IIFEs — multiple obfuscated blocks on the same page clash (same mangled decoder vars) and crash
    try {
      const result = JavaScriptObfuscator.obfuscate(body, OBFUSCATOR_OPTIONS).getObfuscatedCode();
      return `<script${attrs}>${result}</script>`;
    } catch (err) {
      console.warn('  [warn] obfuscation failed for a <script> block, keeping original:', err.message);
      return match;
    }
  });
}

async function buildHtmlFile(relPath) {
  const src = path.join(SRC, relPath);
  const dst = path.join(OUT, relPath);
  if (!fs.existsSync(src)) {
    console.warn(`  [skip] ${relPath} (not found)`);
    return;
  }
  let html = await fs.promises.readFile(src, 'utf8');

  const shouldObfuscate = relPath === 'index.html';
  if (shouldObfuscate) {
    html = obfuscateInlineScripts(html);
  }

  const minified = await minify(html, HTML_MINIFIER_OPTIONS);
  const normalized = minified
    .replace(/[ \t]+(\r?\n)/g, '$1')
    .replace(/\r\n/g, '\n');
  await ensureDir(path.dirname(dst));
  await fs.promises.writeFile(dst, normalized, 'utf8');

  const beforeKB = (Buffer.byteLength(await fs.promises.readFile(src), 'utf8') / 1024).toFixed(1);
  const afterKB = (Buffer.byteLength(normalized, 'utf8') / 1024).toFixed(1);
  console.log(`  ${relPath.padEnd(16)} ${beforeKB} KB  →  ${afterKB} KB` + (shouldObfuscate ? '  (obfuscated)' : ''));
}

async function main() {
  console.log('→ Cleaning dist/ ...');
  try {
    await fs.promises.rm(OUT, { recursive: true, force: true });
  } catch (err) {
    if (!['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(err.code)) throw err;
    console.warn(`  [warn] could not remove dist/ root (${err.code}); emptying contents instead`);
    await emptyDir(OUT);
  }
  await ensureDir(OUT);

  console.log('→ Copying static assets ...');
  for (const dir of ASSET_DIRS) {
    await copyDir(path.join(SRC, dir), path.join(OUT, dir));
  }

  console.log('→ Copying deploy config files ...');
  for (const file of ROOT_FILES) {
    const src = path.join(SRC, file);
    if (fs.existsSync(src)) {
      await fs.promises.copyFile(src, path.join(OUT, file));
      console.log(`  ${file}`);
    }
  }

  console.log('→ Building HTML ...');
  for (const f of HTML_FILES) {
    await buildHtmlFile(f);
  }

  console.log('✓ Build complete. Output: dist/');
}

main().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
