const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Helper: Set text in a cell
function setCellText(cell, text) {
  if (!cell['w:p']) {
    cell['w:p'] = [{
      '@_w14:paraId': '00000000',
      '@_w14:textId': '77777777',
      'w:r': []
    }];
  }

  const para = Array.isArray(cell['w:p']) ? cell['w:p'][0] : cell['w:p'];

  para['w:r'] = [{
    'w:rPr': { 'w:rFonts': { '@_ascii': 'Arial', '@_hAnsi': 'Arial' } },
    'w:t': { '#text': String(text || '') }
  }];
}

// Helper: Get all tables from document
function extractTables(body) {
  const tables = [];

  const collectTables = (items) => {
    if (!items) return;
    const nodeList = Array.isArray(items) ? items : [items];

    nodeList.forEach(node => {
      if (!node) return;

      if (node['w:tbl']) {
        const tbls = Array.isArray(node['w:tbl']) ? node['w:tbl'] : [node['w:tbl']];
        tables.push(...tbls);
      }

      if (node['w:p']) {
        const paras = Array.isArray(node['w:p']) ? node['w:p'] : [node['w:p']];
        paras.forEach(para => {
          if (para['w:tbl']) {
            const tbls = Array.isArray(para['w:tbl']) ? para['w:tbl'] : [para['w:tbl']];
            tables.push(...tbls);
          }
        });
      }
    });
  };

  const bodyArray = Array.isArray(body) ? body : [body];
  collectTables(bodyArray);

  return tables;
}

async function generateFaiDocx(formData) {
  const { FAMILIES, detectFamily } = require('./families');

  const familyKey = formData.familyOverride || detectFamily(formData.partNumber);
  const family = FAMILIES[familyKey] || FAMILIES.OTHER;

  // Load FM 1010 template
  const templatePath = path.join(__dirname, '../FM1010_template.docx');
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = new PizZip(templateBuffer);
  const xmlString = zip.file('word/document.xml').asText();

  // Parse XML
  const parser = new XMLParser();
  const xmlObj = parser.parse(xmlString);

  // Extract tables
  const body = xmlObj['w:document']['w:body'];
  const tables = extractTables(body);

  // Load template mapping
  const mappingPath = path.join(__dirname, '../template-mapping.json');
  let mapping = { tables: {} };
  if (fs.existsSync(mappingPath)) {
    mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  }

  // Build form data object
  const formDataObj = {
    partNumber: formData.partNumber || '',
    partName: formData.partName || family.name || '',
    serialNumber: formData.serialNumber || 'N/A',
    fairId: formData.fairId || '',
    partRev: formData.partRev || 'N/A',
    drawingNumber: formData.drawingNumber || family.drawingNumber || formData.partNumber || '',
    drawingRev: formData.drawingRev || family.drawingRev || 'N/A',
    additionalChanges: formData.additionalChanges || 'N/A',
    woNumber: formData.woNumber || '',
    poNumber: formData.poNumber || 'N/A',
    mfgProcessRef: formData.mfgProcessRef || `Spec 4006 / WO# ${formData.woNumber || ''}`,
    orgName: 'STG AEROSPACE, INC.',
    supplierCode: family.supplierCode || 'STGAERO',
    isAssembly: formData.isAssembly === true || formData.isAssembly === 'true' ? 'X' : '',
    isDetail: !(formData.isAssembly === true || formData.isAssembly === 'true') ? 'X' : '',
    isFullFai: formData.fairType === 'Full' ? 'X' : '',
    isPartialFai: formData.fairType === 'Partial' ? 'X' : '',
    baselinePart: formData.baselinePart || 'N/A',
    fairReason: formData.fairReason || 'N/A',
    hasNcr: formData.hasNcr === true || formData.hasNcr === 'true' ? 'X' : '',
    noNcr: !(formData.hasNcr === true || formData.hasNcr === 'true') ? 'X' : '',
    verifiedBy: formData.verifiedBy || '',
    verifiedDate: formData.verifiedDate || '',
    approvedBy: formData.approvedBy || '',
    approvedDate: formData.approvedDate || '',
    custApproval: formData.custApproval || '',
    custDate: formData.custDate || '',
    comments: formData.comments || '',
    funcTestProc: family.funcTestProc || formData.funcTestProc || '',
    funcTestResult: formData.funcTestResult || `WO ${formData.woNumber || ''}`,
  };

  // Apply mappings to tables
  const tableMapping = mapping.tables || {};

  Object.entries(tableMapping).forEach(([tableIdxStr, rowMapping]) => {
    const tableIdx = parseInt(tableIdxStr);
    if (!tables[tableIdx]) return;

    const table = tables[tableIdx];
    const rows = Array.isArray(table['w:tr']) ? table['w:tr'] : [table['w:tr']];

    Object.entries(rowMapping).forEach(([rowIdxStr, cellMapping]) => {
      const rowIdx = parseInt(rowIdxStr);
      if (!rows[rowIdx]) return;

      const row = rows[rowIdx];
      const cells = Array.isArray(row['w:tc']) ? row['w:tc'] : [row['w:tc']];

      Object.entries(cellMapping).forEach(([cellIdxStr, fieldName]) => {
        const cellIdx = parseInt(cellIdxStr);
        if (!cells[cellIdx]) return;

        const value = formDataObj[fieldName] || '';
        setCellText(cells[cellIdx], value);
      });
    });
  });

  // Convert back to XML and update zip
  const builder = new XMLBuilder();
  const modifiedXml = builder.build(xmlObj);

  zip.file('word/document.xml', modifiedXml);

  // Generate buffer
  return zip.generate({ type: 'nodebuffer' });
}

module.exports = { generateFaiDocx };
