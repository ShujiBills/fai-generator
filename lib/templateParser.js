const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { XMLParser } = require('fast-xml-parser');

// Extract text from a cell
function getCellText(cell) {
  if (!cell) return '';
  if (!cell['w:p']) return '';

  const paragraphs = Array.isArray(cell['w:p']) ? cell['w:p'] : [cell['w:p']];
  return paragraphs
    .map(p => {
      if (!p['w:r']) return '';
      const runs = Array.isArray(p['w:r']) ? p['w:r'] : [p['w:r']];
      return runs.map(r => {
        if (typeof r === 'string') return r;
        return r['w:t'] || '';
      }).join('');
    })
    .join(' ')
    .trim();
}

// Parse template and extract table structure
function parseTemplate(docxBuffer) {
  try {
    const zip = new PizZip(docxBuffer);
    const xmlString = zip.file('word/document.xml').asText();
    const parser = new XMLParser();
    const xmlObj = parser.parse(xmlString);

    const body = xmlObj['w:document']['w:body'];
    const items = Array.isArray(body) ? body : [body];

    // Extract all tables
    const tables = [];

    const collectTables = (nodeList) => {
      if (!nodeList) return;
      const nodes = Array.isArray(nodeList) ? nodeList : [nodeList];

      nodes.forEach(node => {
        if (!node) return;

        // Direct table
        if (node['w:tbl']) {
          const tbls = Array.isArray(node['w:tbl']) ? node['w:tbl'] : [node['w:tbl']];
          tbls.forEach(tbl => {
            tables.push(tbl);
          });
        }

        // Recursively check children
        if (node['w:p']) {
          const paras = Array.isArray(node['w:p']) ? node['w:p'] : [node['w:p']];
          paras.forEach(para => {
            if (para['w:tbl']) {
              const tbls = Array.isArray(para['w:tbl']) ? para['w:tbl'] : [para['w:tbl']];
              tbls.forEach(tbl => {
                tables.push(tbl);
              });
            }
          });
        }
      });
    };

    collectTables(items);

    // Parse each table
    const parsedTables = tables.map((table, tableIdx) => {
      const rows = Array.isArray(table['w:tr']) ? table['w:tr'] : [table['w:tr']];

      const parsedRows = rows.map((row, rowIdx) => {
        const cells = Array.isArray(row['w:tc']) ? row['w:tc'] : [row['w:tc']];

        const parsedCells = cells.map((cell, cellIdx) => {
          const text = getCellText(cell);
          return {
            cellIdx,
            text,
            isEmpty: text.length === 0,
          };
        });

        return {
          rowIdx,
          cells: parsedCells,
        };
      });

      return {
        tableIdx,
        rows: parsedRows,
      };
    });

    return {
      success: true,
      tableCount: tables.length,
      tables: parsedTables,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

// List available data fields
const availableFields = [
  // Common fields
  'partNumber',
  'partName',
  'serialNumber',
  'fairId',
  'partRev',
  'drawingNumber',
  'drawingRev',
  'additionalChanges',
  'woNumber',
  'poNumber',
  'mfgProcessRef',
  'orgName',
  'supplierCode',

  // Form 1 specific
  'isAssembly',
  'isDetail',
  'isFullFai',
  'isPartialFai',
  'baselinePart',
  'fairReason',
  'hasNcr',

  // Sign-off
  'verifiedBy',
  'verifiedDate',
  'approvedBy',
  'approvedDate',
  'custApproval',
  'custDate',
  'comments',

  // Form 2 specific
  'funcTestProc',
  'funcTestResult',

  // Dimensions
  'dimLength',
  'dimWidth',
  'dimHeight',
  'dimMass',
  'dimAngle',

  // Array fields (for tables)
  'index.*',
  'materials.*',
  'characteristics.*',
];

module.exports = {
  parseTemplate,
  getCellText,
  availableFields,
};
