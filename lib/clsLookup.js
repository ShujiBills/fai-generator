// CLS (Cabin Light System) Connector
// Searches CLS work instructions folder and extracts part/assembly data
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { extractTextFromPdf, findPartNumberInText, extractDataFromText } = require('./ocrUtil');

const CLS_ROOT = 'Q:\\QMS PROCEDURES AND FORMS\\LIVE\\WORK INSTRUCTIONS\\PRODUCTION\\CLS';
const OCR_TOOL = path.join(__dirname, '../tools/ocr-pdf.js');

// Find PDF files that match a part number
function findClsPdf(partNumber) {
  const results = [];

  if (!fs.existsSync(CLS_ROOT)) {
    return { found: false, pdfs: [] };
  }

  try {
    const allFiles = fs.readdirSync(CLS_ROOT, { withFileTypes: true, recursive: true })
      .filter(f => !f.isDirectory() && f.name.toLowerCase().endsWith('.pdf'));

    // Search for exact part number match
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of allFiles) {
      const fileName = file.name.toUpperCase();
      const fileNameClean = fileName.replace(/[-\s]/g, '');

      // Match: exact part number in filename
      if (fileNameClean.includes(cleanPartNum)) {
        results.push({
          path: path.join(file.parentPath, file.name),
          name: file.name,
          folder: path.basename(file.parentPath)
        });
      }
    }
  } catch (err) {
    console.error('Error searching CLS folder:', err.message);
  }

  return {
    found: results.length > 0,
    pdfs: results
  };
}

// Extract text from CLS PDF using OCR
function ocrClsPdf(pdfPath) {
  try {
    const result = execSync(`node "${OCR_TOOL}" "${pdfPath}" 4`, {
      timeout: 120000,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return result || '';
  } catch (err) {
    return '';
  }
}

// Extract WI number, part numbers, and data from OCR text
function parseClsData(text, fileName, folderName) {
  const data = {
    wiNumber: null,
    partNumber: null,
    productLine: folderName || 'Unknown',
    revision: null,
    components: [],
    procedures: [],
    rawText: text.substring(0, 2000) // First 2000 chars for reference
  };

  // Extract WI number (e.g., "WI-2071-1" or "WI 2071")
  const wiMatch = text.match(/WI\s*[-]?\s*(\d{4}[-]?\d+)/i);
  if (wiMatch) {
    data.wiNumber = 'WI-' + wiMatch[1].replace(/\s/g, '-');
  }

  // Extract revision (e.g., "REV 1", "Rev A", "Rev IR")
  const revMatch = text.match(/REV[ISION]*\s+([A-Z0-9]+)/i);
  if (revMatch) {
    data.revision = 'REV ' + revMatch[1];
  }

  // Extract part numbers (format: XYZ-NNNN-NN or similar)
  const partMatches = text.match(/([A-Z]{1,3}-?\d{4,5}[-]?\w+)/g);
  if (partMatches) {
    data.components = [...new Set(partMatches)].slice(0, 10);
  }

  // Extract assembly/procedure keywords
  const procedureMatches = text.match(/(ASSEMBLY|ASSEMBLY|TEST|SOLDER|WELD|INSPECTION|INSTALL|CONFIGURE|PROGRAM|CALIBRATION)/gi);
  if (procedureMatches) {
    data.procedures = [...new Set(procedureMatches)];
  }

  return data;
}

// Main function: lookup CLS data for a part number
async function lookupClsData(partNumber) {
  const { found, pdfs } = findClsPdf(partNumber);

  if (!found || pdfs.length === 0) {
    return {
      found: false,
      partNumber,
      message: `CLS work instruction not found for part number ${partNumber}. Check Q:\\QMS PROCEDURES AND FORMS\\LIVE\\WORK INSTRUCTIONS\\PRODUCTION\\CLS`,
    };
  }

  // Use the first matching PDF
  const pdfFile = pdfs[0];
  const ocrText = ocrClsPdf(pdfFile.path);

  if (!ocrText.trim()) {
    return {
      found: false,
      partNumber,
      message: `Found CLS PDF but could not read it: ${pdfFile.name}`,
    };
  }

  const clsData = parseClsData(ocrText, pdfFile.name, pdfFile.folder);

  return {
    found: true,
    partNumber,
    pdfFile: pdfFile.name,
    folder: pdfFile.folder,
    wiNumber: clsData.wiNumber,
    productLine: clsData.productLine,
    revision: clsData.revision,
    components: clsData.components,
    procedures: clsData.procedures,
  };
}

module.exports = { lookupClsData };
