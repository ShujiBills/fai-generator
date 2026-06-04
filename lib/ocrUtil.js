// OCR Utility Module
// Provides OCR capabilities for extracting text from PDFs and images
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to OCR tool (tesseract via nodejs-tesseract or system binary)
const OCR_TOOL = path.join(__dirname, '../tools/ocr-pdf.js');

// Cache for OCR results (filepath -> text)
const ocrCache = new Map();

// Extract text from PDF using OCR
async function extractTextFromPdf(pdfPath, maxPages = 10) {
  try {
    // Check cache first
    if (ocrCache.has(pdfPath)) {
      return ocrCache.get(pdfPath);
    }

    // Call OCR tool
    if (!fs.existsSync(OCR_TOOL)) {
      console.warn(`OCR tool not found at ${OCR_TOOL}`);
      return '';
    }

    let result = '';
    try {
      result = execSync(`node "${OCR_TOOL}" "${pdfPath}" ${maxPages}`, {
        timeout: 120000,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch (err) {
      console.error(`OCR error for ${path.basename(pdfPath)}:`, err.message);
      return '';
    }

    // Cache the result
    if (result) {
      ocrCache.set(pdfPath, result);
    }

    return result || '';
  } catch (err) {
    console.error('Error extracting PDF text:', err.message);
    return '';
  }
}

// Search for part number in OCR text (handles OCR errors)
function findPartNumberInText(text, partNumber) {
  if (!text || !partNumber) return false;

  const cleanPart = String(partNumber).toUpperCase().replace(/[-\s]/g, '');
  const cleanText = text.toUpperCase().replace(/[-\s]/g, '');

  // Exact match
  if (cleanText.includes(cleanPart)) return true;

  // Fuzzy match for OCR errors (e.g., S → 5, 0 → O)
  const fuzzyPattern = partNumber
    .toUpperCase()
    .split('')
    .map(c => {
      if (c === 'O') return '[O0]';
      if (c === 'I') return '[I1L]';
      if (c === 'S') return '[S5]';
      if (c === 'Z') return '[Z2]';
      if (c === '0') return '[O0]';
      if (c === '1') return '[I1L]';
      if (c === '5') return '[S5]';
      if (c === '2') return '[Z2]';
      return c;
    })
    .join('[\\s\\-]*');

  const fuzzyRegex = new RegExp(fuzzyPattern);
  return fuzzyRegex.test(cleanText);
}

// Extract structured data from OCR text
function extractDataFromText(text) {
  if (!text) return null;

  const data = {
    partNumbers: [],
    batchNumbers: [],
    revisions: [],
    dates: [],
    status: null,
    rawText: text.substring(0, 1000)
  };

  // Extract part numbers (various formats)
  const partMatches = text.match(/\b([A-Z]{2,3}-?\d{4,5}(?:-[\w]{1,3})?)\b/g);
  if (partMatches) {
    data.partNumbers = [...new Set(partMatches)].slice(0, 10);
  }

  // Extract batch numbers
  const batchMatches = text.match(/(?:BATCH|BATCH\/COC|B\/C)[\s:]*([A-Z0-9\/\-]+)/gi);
  if (batchMatches) {
    data.batchNumbers = batchMatches.map(m => m.replace(/(?:BATCH|BATCH\/COC|B\/C)[\s:]*/i, '').trim());
  }

  // Extract revision levels
  const revMatches = text.match(/REV[ISION]*\s+([A-Z0-9]+)/gi);
  if (revMatches) {
    data.revisions = [...new Set(revMatches.map(m => m.replace(/REV[ISION]*\s+/i, '').trim()))];
  }

  // Extract dates (various formats)
  const dateMatches = text.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/g);
  if (dateMatches) {
    data.dates = [...new Set(dateMatches)].slice(0, 5);
  }

  // Detect pass/fail status
  if (/PASS|PASSED|ACCEPT|APPROVED/i.test(text)) {
    data.status = 'PASS';
  } else if (/FAIL|FAILED|REJECT|DENIED/i.test(text)) {
    data.status = 'FAIL';
  }

  return data;
}

// Batch OCR multiple files and cache results
async function batchOcrFiles(filePaths, maxPages = 5) {
  const results = {};

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;

    const fileName = path.basename(filePath);
    const text = await extractTextFromPdf(filePath, maxPages);
    results[fileName] = {
      text,
      data: extractDataFromText(text)
    };
  }

  return results;
}

// Clear OCR cache for a specific file or all files
function clearOcrCache(filePath = null) {
  if (filePath) {
    ocrCache.delete(filePath);
  } else {
    ocrCache.clear();
  }
}

// Get cache statistics
function getOcrCacheStats() {
  return {
    cachedFiles: ocrCache.size,
    estimatedMemoryMB: (ocrCache.size * 50) / 1024 // Rough estimate
  };
}

module.exports = {
  extractTextFromPdf,
  findPartNumberInText,
  extractDataFromText,
  batchOcrFiles,
  clearOcrCache,
  getOcrCacheStats
};
