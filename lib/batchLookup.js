// Looks up WO picking lists to pre-fill Form 2 batch/CoC numbers
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WIP_FAI_ROOT = 'Q:\\USA TXS\\20X. FAI\'s and Log\\WIP FAI';
const OCR_TOOL = path.join(__dirname, '../tools/ocr-pdf.js');

// Find PDF files that likely contain a WO picking list for a given WO number
function findWoPdfs(woNumber) {
  const exact = [];    // filename contains WO + number
  const generic = []; // "Works Order*.pdf", "WO*.pdf", "*WO*.pdf" — need OCR to confirm
  if (!fs.existsSync(WIP_FAI_ROOT)) return { exact, generic };

  const faiDirs = fs.readdirSync(WIP_FAI_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(WIP_FAI_ROOT, d.name));

  const WO_GENERIC_RE = /^(works\s*order|wo\s*and|batch\s*works)/i;

  for (const dir of faiDirs) {
    let files;
    try { files = fs.readdirSync(dir); } catch { continue; }

    for (const f of files) {
      if (!f.toLowerCase().endsWith('.pdf')) continue;
      const fUpper = f.toUpperCase();
      if (fUpper.includes('WO') && fUpper.includes(String(woNumber))) {
        exact.push(path.join(dir, f));
      } else if (WO_GENERIC_RE.test(f)) {
        generic.push(path.join(dir, f));
      }
    }
  }
  return { exact, generic };
}

// OCR a PDF and return text (via our existing tool)
function ocrPdf(pdfPath) {
  try {
    const result = execSync(`node "${OCR_TOOL}" "${pdfPath}" 4`, {
      timeout: 120000,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return result;
  } catch {
    return '';
  }
}

// Normalise OCR text: collapse whitespace, fix common artifacts
function normalise(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/--/g, '-')            // double dash → single
    .replace(/[•·]/g, '-')          // bullet variants → dash
    // Fix OCR misread of "Batch" → "3atch"/"Satch"/"3atch" etc.
    .replace(/[3S][Aa]tch[i\/\\|][Ss]erial/gi, 'Batch/Serial')
    .replace(/[3S]atch[i\/\\|]/gi, 'Batch/')
    .trim();
}

// Extract WO number from OCR text
function extractWoNumber(text) {
  const m = text.match(/W\s*[\/\\|I]\s*O\s*Number\s*[:\s]*W?O?\s*(\d{4,6})/i)
            || text.match(/WIO\s*Number\s*[:\s]*W?O?\s*(\d{4,6})/i)
            || text.match(/W\.O\.\s+(\d{4,6})/i)
            || text.match(/Number\s*W?O?\s*(\d{4,6})/i);
  return m ? m[1] : null;
}

// Check if text likely contains a given WO number (handles garbled OCR)
function textContainsWo(text, wo) {
  const found = extractWoNumber(text);
  if (found === wo) return true;
  // Broader check: look for the WO number as a standalone digit sequence in first 1000 chars
  const head = text.substring(0, 1000);
  return head.includes(wo);
}

// Find the batch value that follows a "Batch/Serial Number :" marker in text
function extractBatchAfterMarker(text, markerIndex) {
  const afterMarker = text.substring(markerIndex).replace(/^[^:]+:\s*/, '');
  const m = afterMarker.match(/^(N\/A|[\w\/\-]+)/);
  if (!m) return null;
  let batch = m[1].replace(/[—\-]+$/, '').trim();
  if (batch === 'N/A' || batch.length < 2) return null;

  // Fix OCR reading "/" as "1": for 7-8 digit strings like "21119488" → "21/19488"
  // Pattern: 2-digit year + "1" (the OCR'd slash) + 4-6 digit seq = 7-9 total digits
  if (/^\d{7,9}$/.test(batch)) {
    // Try splitting: YY + / + remaining
    const candidate = batch.substring(0, 2) + '/' + batch.substring(3);
    // Valid if middle char was a "1" (OCR'd slash) and result makes sense
    if (batch[2] === '1' && /^\d{4,6}$/.test(batch.substring(3))) {
      batch = candidate;
    } else {
      batch = batch.substring(0, 2) + '/' + batch.substring(2);
    }
  }
  return batch;
}

// Find the batch number for a given spec/part code in the WO picking list text
// allSpecs: other known spec codes — used to detect when batch belongs to a different item
function findBatchForSpec(cleanText, spec, allSpecs) {
  if (!spec || spec === 'N/A') return null;

  const upperText = cleanText.toUpperCase();
  let idx = upperText.indexOf(spec.toUpperCase());

  // If not found, fuzzy match for SG-prefix part codes (OCR substitutes letters)
  if (idx === -1 && /^[A-Z]{2}\d{4}/.test(spec)) {
    const digits = spec.replace(/[^0-9]/g, '');
    const re = new RegExp('[A-Z$]{1,3}' + digits.split('').join('[^\\s]{0,1}'), 'i');
    const m = cleanText.match(re);
    if (m) idx = cleanText.indexOf(m[0]);
  }

  if (idx === -1) return null;

  // Search for batch marker within 600 chars after the spec code
  const searchWindow = cleanText.substring(idx + spec.length, idx + spec.length + 600);
  const batchIdx = searchWindow.search(/Batch\s*[\/|\\]\s*Serial\s*Number\s*[:\s]/i);
  if (batchIdx === -1) return null;

  // Reject if another known spec code appears between this spec and the batch marker
  // (means the batch belongs to that other spec, not this one)
  const between = searchWindow.substring(0, batchIdx).toUpperCase();
  if (allSpecs) {
    for (const other of allSpecs) {
      if (other === spec) continue;
      if (other.length >= 8 && between.includes(other.toUpperCase())) return null;
    }
  }

  const fullAfter = searchWindow.substring(batchIdx);
  return extractBatchAfterMarker(fullAfter, 0);
}

// Main function: look up WO picking list and return batch numbers per spec
async function lookupWoBatches(woNumber, materialSpecs) {
  const wo = String(woNumber).replace(/^WO/i, '').trim();
  const { exact, generic } = findWoPdfs(wo);

  // Try exact filename match first
  let pdfPath = exact[0] || null;

  // If not found by filename, scan generic "Works Order*.pdf" files for the WO number (up to 10)
  if (!pdfPath) {
    for (const gf of generic.slice(0, 10)) {
      const raw = ocrPdf(gf);
      if (!raw) continue;
      const t = normalise(raw);
      if (textContainsWo(t, wo)) {
        pdfPath = gf;
        break;
      }
    }
  }

  if (!pdfPath) {
    return {
      found: false, woNumber: wo,
      message: `WO picking list not found for WO# ${wo}. ` +
        `Save the WO PDF as "WO ${wo}.pdf" in Q:\\USA TXS\\20X. FAI's and Log\\WIP FAI\\[FAI folder]\\ and try again.`,
    };
  }

  const raw = ocrPdf(pdfPath);
  if (!raw.trim()) {
    return { found: false, woNumber: wo, message: `Found WO PDF but could not read it: ${path.basename(pdfPath)}` };
  }

  const text = normalise(raw);
  const foundWo = extractWoNumber(text);

  // Map spec → batch
  const batches = {};
  const specs = (materialSpecs || []).filter(Boolean);
  for (const spec of specs) {
    const batch = findBatchForSpec(text, spec, specs);
    if (batch) batches[spec] = batch;
  }

  return {
    found: true,
    woNumber: foundWo || wo,
    pdfFile: path.basename(pdfPath),
    batches,
  };
}

module.exports = { lookupWoBatches };
