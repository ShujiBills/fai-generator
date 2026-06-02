const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

async function generateFaiDocx(formData) {
  const { FAMILIES, detectFamily } = require('./families');

  const familyKey = formData.familyOverride || detectFamily(formData.partNumber);
  const family = FAMILIES[familyKey] || FAMILIES.OTHER;

  // Load the FM 1010 template
  const templatePath = path.join(__dirname, '../FM1010_template.docx');
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = new PizZip(templateBuffer);

  // Parse document.xml
  const xmlString = zip.file('word/document.xml').asText();
  const parser = new XMLParser();
  const xmlObj = parser.parse(xmlString);

  // Get the document body
  let body = xmlObj['w:document']['w:body'];
  if (!Array.isArray(body)) {
    body = [body];
  }

  // Find tables in the document
  const tables = [];
  const collectTables = (items) => {
    if (!items) return;
    if (!Array.isArray(items)) items = [items];
    items.forEach(item => {
      if (item['w:tbl']) {
        tables.push(item['w:tbl']);
      }
      if (item['w:p']) {
        const para = Array.isArray(item['w:p']) ? item['w:p'] : [item['w:p']];
        para.forEach(p => {
          if (p['w:tbl']) {
            const t = Array.isArray(p['w:tbl']) ? p['w:tbl'] : [p['w:tbl']];
            tables.push(...t);
          }
        });
      }
    });
  };
  collectTables(body);

  console.log(`Found ${tables.length} tables in template`);

  // Helper: Find cell containing text
  function findCellWithText(table, searchText) {
    const rows = Array.isArray(table['w:tr']) ? table['w:tr'] : [table['w:tr']];
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const cells = Array.isArray(rows[rowIdx]['w:tc']) ? rows[rowIdx]['w:tc'] : [rows[rowIdx]['w:tc']];
      for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
        const cellText = getCellText(cells[cellIdx]);
        if (cellText.includes(searchText)) {
          return { rowIdx, cellIdx, cell: cells[cellIdx] };
        }
      }
    }
    return null;
  }

  // Helper: Get text content from a cell
  function getCellText(cell) {
    if (!cell['w:p']) return '';
    const paragraphs = Array.isArray(cell['w:p']) ? cell['w:p'] : [cell['w:p']];
    return paragraphs
      .map(p => {
        if (!p['w:r']) return '';
        const runs = Array.isArray(p['w:r']) ? p['w:r'] : [p['w:r']];
        return runs.map(r => r['w:t'] || '').join('');
      })
      .join(' ');
  }

  // Helper: Set cell text
  function setCellText(cell, text) {
    if (!cell['w:p']) {
      cell['w:p'] = [{ '@_w14:paraId': '00000000', '@_w14:textId': '77777777', 'w:r': [] }];
    }
    const para = Array.isArray(cell['w:p']) ? cell['w:p'][0] : cell['w:p'];
    para['w:r'] = [{
      'w:t': { '#text': text }
    }];
  }

  // Helper: Get next cell in the same row
  function getNextCell(table, rowIdx, cellIdx) {
    const rows = Array.isArray(table['w:tr']) ? table['w:tr'] : [table['w:tr']];
    const cells = Array.isArray(rows[rowIdx]['w:tc']) ? rows[rowIdx]['w:tc'] : [rows[rowIdx]['w:tc']];
    return cells[cellIdx + 1];
  }

  // FORM 1 - Part Number Accountability
  if (tables.length > 0) {
    const form1 = tables[0];

    // Find and fill Part Number
    let match = findCellWithText(form1, 'Part Number:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.partNumber || '');
    }

    // Find and fill Part Name
    match = findCellWithText(form1, 'Part Name:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.partName || family.name || '');
    }

    // Find and fill Serial Number
    match = findCellWithText(form1, 'Serial Number:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.serialNumber || 'N/A');
    }

    // Find and fill FAIR Identifier
    match = findCellWithText(form1, 'FAIR Identifier:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.fairId || '');
    }

    // Part Revision Level
    match = findCellWithText(form1, 'Part Revision Level:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.partRev || 'N/A');
    }

    // Drawing Number
    match = findCellWithText(form1, 'Drawing Number:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.drawingNumber || family.drawingNumber || formData.partNumber || '');
    }

    // Drawing Revision Level
    match = findCellWithText(form1, 'Drawing Revision Level:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.drawingRev || family.drawingRev || 'N/A');
    }

    // Additional Changes
    match = findCellWithText(form1, 'Additional Changes:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.additionalChanges || 'N/A');
    }

    // Manufacturing Process Reference
    match = findCellWithText(form1, 'Manufacturing Process Reference:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.mfgProcessRef || `Spec 4006 / WO# ${formData.woNumber || ''}`);
    }

    // Organization Name
    match = findCellWithText(form1, 'Organization Name:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, 'STG AEROSPACE, INC.');
    }

    // Supplier Code
    match = findCellWithText(form1, 'Supplier Code:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, family.supplierCode || 'STGAERO');
    }

    // P.O. Number
    match = findCellWithText(form1, 'P.O. Number:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.poNumber || 'N/A');
    }

    // Assembly/Detail checkboxes - mark with X
    match = findCellWithText(form1, 'Assembly FAI:');
    if (match && formData.isAssembly) {
      setCellText(match.cell, '☑');
    }

    // FAIR verified by
    match = findCellWithText(form1, 'FAIR verified by:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.verifiedBy || '');
    }

    // Verified date
    match = findCellWithText(form1, 'Date:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.verifiedDate || '');
    }

    // Comments
    match = findCellWithText(form1, 'Comments:');
    if (match) {
      const nextCell = getNextCell(form1, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.comments || '');
    }
  }

  // FORM 2 - Materials
  if (tables.length > 1) {
    const form2 = tables[1];

    // Similar pattern for Form 2 fields...
    let match = findCellWithText(form2, 'Part Number:');
    if (match) {
      const nextCell = getNextCell(form2, match.rowIdx, match.cellIdx);
      if (nextCell) setCellText(nextCell, formData.partNumber || '');
    }

    // Material rows would go here
    // This is more complex because we need to identify the material table
    // and fill in multiple rows
  }

  // FORM 3 - Characteristics
  if (tables.length > 2) {
    const form3 = tables[2];
    // Similar pattern...
  }

  // Convert back to DOCX
  const builder = new XMLBuilder();
  const modifiedXml = builder.build(xmlObj);

  // Update the document in the zip
  zip.file('word/document.xml', modifiedXml);

  // Generate buffer
  return zip.generate({ type: 'nodebuffer' });
}

module.exports = { generateFaiDocx };
