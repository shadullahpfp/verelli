import { chromium } from "playwright";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");
const webRoot = path.resolve(__dirname, "..");
const publicHero = path.join(webRoot, "public/hero");
const rawHero = path.join(publicHero, "_raw");
const brandDir = path.join(webRoot, "public/brand");
const previewDir = "/tmp/hero-preview";

// Ensure output directories exist
if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// Display sizes (CSS px) on the live page
const DISPLAY_SIZES = {
  graveyard: 280,
  survival: 150,
  funnel: 240,
  cloud: 340,
};

// Helper to find font file
function findFontFile(pkgName, relPath) {
  const localPath = path.join(webRoot, "node_modules", pkgName, relPath);
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.join(projectRoot, "node_modules", pkgName, relPath);
  if (fs.existsSync(rootPath)) return rootPath;
  throw new Error(`Font file not found: ${pkgName}/${relPath}`);
}

function getFontBase64(pkgName, relPath) {
  const fontPath = findFontFile(pkgName, relPath);
  return fs.readFileSync(fontPath).toString("base64");
}

function getRawImageURI(filename) {
  const filePath = path.join(rawHero, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Raw image not found: ${filePath}`);
  }
  return `data:image/webp;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function getBrandLogoURI(filename) {
  const filePath = path.join(brandDir, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

const fontInstrumentSerifItalic = getFontBase64(
  "@fontsource/instrument-serif",
  "files/instrument-serif-latin-400-italic.woff2"
);
const fontPlusJakartaSans500 = getFontBase64(
  "@fontsource/plus-jakarta-sans",
  "files/plus-jakarta-sans-latin-500-normal.woff2"
);
const fontPlusJakartaSans600 = getFontBase64(
  "@fontsource/plus-jakarta-sans",
  "files/plus-jakarta-sans-latin-600-normal.woff2"
);
const fontJetBrainsMono400 = getFontBase64(
  "@fontsource/jetbrains-mono",
  "files/jetbrains-mono-latin-400-normal.woff2"
);
const fontJetBrainsMono600 = getFontBase64(
  "@fontsource/jetbrains-mono",
  "files/jetbrains-mono-latin-600-normal.woff2"
);

function getBaseStyles(rawURI) {
  return `
  @font-face {
    font-family: 'Instrument Serif';
    font-style: italic;
    font-weight: 400;
    src: url(data:font/woff2;base64,${fontInstrumentSerifItalic}) format('woff2');
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 500;
    src: url(data:font/woff2;base64,${fontPlusJakartaSans500}) format('woff2');
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 600;
    src: url(data:font/woff2;base64,${fontPlusJakartaSans600}) format('woff2');
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400;
    src: url(data:font/woff2;base64,${fontJetBrainsMono400}) format('woff2');
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 600;
    src: url(data:font/woff2;base64,${fontJetBrainsMono600}) format('woff2');
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    width: 800px;
    height: 800px;
    background-color: #191E0B;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
  }

  .backdrop-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.76;
    filter: saturate(1.1);
  }

  .canvas-overlay {
    position: absolute;
    inset: 0;
    background-color: #11120E;
    opacity: 0.22;
  }

  .radial-scrim {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(17, 18, 14, 0.58) 0%, rgba(17, 18, 14, 0.42) 50%, rgba(17, 18, 14, 0.0) 72%);
  }

  .inner-ring {
    position: absolute;
    inset: 0;
    border: 3px solid rgba(243, 244, 239, 0.14);
    border-radius: inherit;
    pointer-events-none;
    z-index: 20;
  }

  .text-crisp {
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
  }
  `;
}

// 1. Template: hero-graveyard (display 280px, scale = 800 / 280 = 2.857)
function getGraveyardTemplate() {
  const displaySize = DISPLAY_SIZES.graveyard;
  const scale = 800 / displaySize;
  const rawURI = getRawImageURI("hero-graveyard.webp");
  const logoURI = getBrandLogoURI("startups-rip-logo.svg");

  const logoHeight = Math.round(44 * scale);
  const numberSize = Math.round(56 * scale);
  const labelSize = Math.round(16 * scale);
  const pillSize = Math.round(12 * scale);
  const pillPaddingY = Math.round(7 * scale);
  const pillPaddingX = Math.round(18 * scale);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    ${getBaseStyles(rawURI)}
    .safe-zone {
      position: relative;
      z-index: 10;
      width: 580px;
      height: 580px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .brand-logo-pill {
      background: rgba(17, 18, 14, 0.75);
      border: 1px solid #35382F;
      padding: ${Math.round(4 * scale)}px ${Math.round(14 * scale)}px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 ${Math.round(2 * scale)}px ${Math.round(12 * scale)}px rgba(0,0,0,0.5);
      margin-bottom: ${Math.round(12 * scale)}px;
    }
    .brand-logo-img {
      height: ${Math.round(36 * scale)}px;
      width: auto;
      object-fit: contain;
      border-radius: ${Math.round(6 * scale)}px;
    }
    .stat-number {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: ${numberSize}px;
      line-height: 0.95;
      color: #F3F4EF;
      letter-spacing: -0.02em;
    }
    .stat-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${labelSize}px;
      font-weight: 500;
      color: #EDEFE6;
      margin-top: ${Math.round(6 * scale)}px;
    }
    .cause-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${pillSize}px;
      letter-spacing: 0.05em;
      color: #E5645A;
      background: rgba(229, 100, 90, 0.18);
      border: 1px solid rgba(229, 100, 90, 0.42);
      padding: ${pillPaddingY}px ${pillPaddingX}px;
      border-radius: 9999px;
      margin-top: ${Math.round(14 * scale)}px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <img class="backdrop-img" src="${rawURI}" alt="" />
  <div class="canvas-overlay"></div>
  <div class="radial-scrim"></div>
  <div class="inner-ring" style="border-radius: 50%;"></div>

  <div class="safe-zone text-crisp">
    ${
      logoURI
        ? `<div class="brand-logo-pill"><img class="brand-logo-img" src="${logoURI}" alt="Startups.RIP" /></div>`
        : `<div class="cause-pill" style="margin-bottom: ${Math.round(10 * scale)}px;">STARTUPS.RIP</div>`
    }
    <div class="stat-number">1,740+</div>
    <div class="stat-label">Dead YC Startups</div>
    <div class="cause-pill">#1 Cause: No PMF</div>
  </div>
</body>
</html>
`;
}

// 2. Template: hero-survival (display 150px, scale = 800 / 150 = 5.333)
function getSurvivalTemplate() {
  const displaySize = DISPLAY_SIZES.survival;
  const scale = 800 / displaySize;
  const rawURI = getRawImageURI("hero-survival.webp");

  const numberSize = Math.round(44 * scale);
  const labelSize = Math.round(12 * scale);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    ${getBaseStyles(rawURI)}
    .safe-zone {
      position: relative;
      z-index: 10;
      width: 580px;
      height: 580px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .survival-number {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: ${numberSize}px;
      line-height: 0.95;
      color: #B8C468;
      letter-spacing: -0.03em;
    }
    .survival-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${labelSize}px;
      font-weight: 600;
      letter-spacing: 0.14em;
      color: #D5D8CE;
      text-transform: uppercase;
      margin-top: ${Math.round(10 * scale)}px;
    }
  </style>
</head>
<body>
  <img class="backdrop-img" src="${rawURI}" alt="" />
  <div class="canvas-overlay"></div>
  <div class="radial-scrim"></div>
  <div class="inner-ring" style="border-radius: 50%;"></div>

  <div class="safe-zone text-crisp">
    <div class="survival-number">84%</div>
    <div class="survival-label">SURVIVAL</div>
  </div>
</body>
</html>
`;
}

// 3. Template: hero-funnel (display 240px, scale = 800 / 240 = 3.333)
function getFunnelTemplate() {
  const displaySize = DISPLAY_SIZES.funnel;
  const scale = 800 / displaySize;
  const rawURI = getRawImageURI("hero-funnel.webp");

  const tagSize = Math.round(11 * scale);
  const numberSize = Math.round(50 * scale);
  const labelSize = Math.round(15 * scale);
  const pillSize = Math.round(12 * scale);
  const pillPaddingY = Math.round(6 * scale);
  const pillPaddingX = Math.round(16 * scale);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    ${getBaseStyles(rawURI)}
    .safe-zone {
      position: relative;
      z-index: 10;
      width: 580px;
      height: 580px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .funnel-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${tagSize}px;
      letter-spacing: 0.18em;
      color: #9A9D93;
      text-transform: uppercase;
      margin-bottom: ${Math.round(6 * scale)}px;
    }
    .funnel-number {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: ${numberSize}px;
      line-height: 0.95;
      color: #B8C468;
      letter-spacing: -0.02em;
    }
    .funnel-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${labelSize}px;
      font-weight: 500;
      color: #F3F4EF;
      margin-top: ${Math.round(6 * scale)}px;
    }
    .funnel-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${pillSize}px;
      letter-spacing: 0.08em;
      color: #4ADE80;
      background: rgba(74, 222, 128, 0.14);
      border: 1px solid rgba(74, 222, 128, 0.38);
      padding: ${pillPaddingY}px ${pillPaddingX}px;
      border-radius: 9999px;
      margin-top: ${Math.round(14 * scale)}px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <img class="backdrop-img" src="${rawURI}" alt="" />
  <div class="canvas-overlay"></div>
  <div class="radial-scrim"></div>
  <div class="inner-ring" style="border-radius: 50%;"></div>

  <div class="safe-zone text-crisp">
    <div class="funnel-tag">FAKE-DOOR TEST</div>
    <div class="funnel-number">14.2%</div>
    <div class="funnel-label">Waitlist CVR</div>
    <div class="funnel-pill">48h Pre-Build</div>
  </div>
</body>
</html>
`;
}

// 4. Template: hero-cloud (display 340px, scale = 800 / 340 = 2.353)
function getCloudTemplate() {
  const displaySize = DISPLAY_SIZES.cloud;
  const scale = 800 / displaySize;
  const rawURI = getRawImageURI("hero-cloud.webp");

  const chipSize = Math.round(12 * scale);
  const chipPaddingY = Math.round(6 * scale);
  const chipPaddingX = Math.round(18 * scale);
  const categorySize = Math.round(12 * scale);
  const headlineSize = Math.round(24 * scale);
  const footerSize = Math.round(13 * scale);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    ${getBaseStyles(rawURI)}
    .safe-zone {
      position: relative;
      z-index: 10;
      width: 580px;
      height: 580px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      padding: ${Math.round(18 * scale)}px 0;
    }
    .chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${chipSize}px;
      letter-spacing: 0.14em;
      color: #C5D37A;
      background: rgba(54, 62, 29, 0.92);
      border: 1px solid #4F5A2C;
      padding: ${chipPaddingY}px ${chipPaddingX}px;
      border-radius: 9999px;
      display: inline-block;
      text-transform: uppercase;
    }
    .category {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${categorySize}px;
      letter-spacing: 0.22em;
      color: #80979A;
      text-transform: uppercase;
      margin-top: ${Math.round(20 * scale)}px;
    }
    .headline-1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${headlineSize}px;
      font-weight: 600;
      color: #F3F4EF;
      line-height: 1.15;
      margin-top: ${Math.round(6 * scale)}px;
    }
    .headline-2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${headlineSize}px;
      font-weight: 600;
      color: #B8C468;
      line-height: 1.15;
      margin-top: ${Math.round(4 * scale)}px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.16);
      margin: ${Math.round(20 * scale)}px 0 ${Math.round(14 * scale)}px 0;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: ${Math.round(24 * scale)}px;
    }
    .footer-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: ${footerSize}px;
      color: #9A9D93;
    }
    .footer-value {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${footerSize}px;
      font-weight: 600;
      color: #EDEFE6;
    }
  </style>
</head>
<body>
  <img class="backdrop-img" src="${rawURI}" alt="" />
  <div class="canvas-overlay"></div>
  <div class="radial-scrim"></div>
  <div class="inner-ring" style="border-radius: 36px;"></div>

  <div class="safe-zone text-crisp">
    <div>
      <div class="chip">LIVE SYNTHESIS</div>
      <div class="category">YOUR IDEA</div>
      <div class="headline-1">3 Dead Twins</div>
      <div class="headline-2">5 Live Winners</div>
    </div>
    <div>
      <div class="divider"></div>
      <div class="footer-row">
        <span class="footer-label">Wedge Angle</span>
        <span class="footer-value">B2B Micro-SaaS</span>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

async function renderCard(browser, html, outputWebP, displaySize, previewName) {
  const page = await browser.newPage({
    viewport: { width: 800, height: 800, deviceScaleFactor: 2 },
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(200);

  const pngBuffer = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: 800, height: 800 },
  });
  await page.close();

  // 1. Output -v2 WebP at quality 88
  await sharp(pngBuffer)
    .resize(800, 800)
    .webp({ quality: 88 })
    .toFile(outputWebP);

  // 2. Output exact DISPLAY_SIZE preview PNG into /tmp/hero-preview/
  const previewPath = path.join(previewDir, `${previewName}-${displaySize}px.png`);
  await sharp(pngBuffer)
    .resize(displaySize, displaySize)
    .png()
    .toFile(previewPath);

  console.log(`✓ Rendered 800x800 WebP: ${path.basename(outputWebP)} (scale=${(800 / displaySize).toFixed(2)})`);
  console.log(`  Preview PNG: ${previewPath} (${displaySize}x${displaySize})`);
}

async function main() {
  console.log("🎨 Starting Scaled Pomelli Hero Cards Renderer (Playwright + Sharp)...");

  const browser = await chromium.launch({ headless: true });

  try {
    await renderCard(
      browser,
      getGraveyardTemplate(),
      path.join(publicHero, "hero-graveyard-v2.webp"),
      DISPLAY_SIZES.graveyard,
      "hero-graveyard"
    );

    await renderCard(
      browser,
      getSurvivalTemplate(),
      path.join(publicHero, "hero-survival-v2.webp"),
      DISPLAY_SIZES.survival,
      "hero-survival"
    );

    await renderCard(
      browser,
      getFunnelTemplate(),
      path.join(publicHero, "hero-funnel-v2.webp"),
      DISPLAY_SIZES.funnel,
      "hero-funnel"
    );

    await renderCard(
      browser,
      getCloudTemplate(),
      path.join(publicHero, "hero-cloud-v2.webp"),
      DISPLAY_SIZES.cloud,
      "hero-cloud"
    );

    console.log("✨ All 4 -v2 hero card images rendered successfully!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Error rendering hero cards:", err);
  process.exit(1);
});
