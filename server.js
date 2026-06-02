const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateFaiDocx } = require('./lib/generate');
const { getNextFairNumber, saveFairDoc, appendToLog } = require('./lib/fairLog');
const { lookupWoBatches } = require('./lib/batchLookup');
const { lookupClsData } = require('./lib/clsLookup');
const { parseTemplate, availableFields } = require('./lib/templateParser');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get next FAIR number suggestion
app.get('/next-fair-id', (req, res) => {
  try {
    const nextId = getNextFairNumber();
    res.json({ nextId });
  } catch (err) {
    res.json({ nextId: 'FAI-103' });
  }
});

// Look up WO picking list for batch numbers
app.get('/api/lookup-wo', async (req, res) => {
  try {
    const { wo, specs } = req.query;
    if (!wo) return res.status(400).json({ error: 'wo parameter required' });
    const specList = specs ? specs.split(',').map(s => s.trim()).filter(Boolean) : [];
    const result = await lookupWoBatches(wo, specList);
    res.json(result);
  } catch (err) {
    console.error('lookup-wo error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Look up CLS (Cabin Light System) work instructions
app.get('/api/lookup-cls', async (req, res) => {
  try {
    const { partNumber } = req.query;
    if (!partNumber) return res.status(400).json({ error: 'partNumber parameter required' });
    const result = await lookupClsData(partNumber);
    res.json(result);
  } catch (err) {
    console.error('lookup-cls error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate FAI document
app.post('/generate', async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.partNumber) return res.status(400).json({ error: 'Part Number is required' });
    if (!formData.fairId) return res.status(400).json({ error: 'FAIR Number is required' });
    if (!formData.verifiedBy) return res.status(400).json({ error: 'Verified By name is required' });

    // Override family key from client detection
    if (formData.familyKey) {
      formData.familyOverride = formData.familyKey;
    }

    // Generate the DOCX buffer
    const buffer = await generateFaiDocx(formData);

    // Save to Q: drive
    const saved = saveFairDoc(buffer, formData.fairId, formData.partNumber);

    // Try to update FAI Log
    const { FAMILIES, detectFamily } = require('./lib/families');
    const fk = formData.familyOverride || detectFamily(formData.partNumber);
    const family = FAMILIES[fk] || FAMILIES.OTHER;

    appendToLog({
      fairId: formData.fairId,
      fairType: formData.fairType || 'Full',
      partNumber: formData.partNumber,
      partName: formData.partName || family.name,
      drawingNumber: formData.drawingNumber || family.drawingNumber || formData.partNumber,
      drawingRev: formData.drawingRev || family.drawingRev || '',
      woNumber: formData.woNumber || '',
      verifiedBy: formData.verifiedBy || '',
      approvedBy: formData.approvedBy || '',
    });

    res.json({
      success: true,
      fileName: saved.fileName,
      folderPath: saved.folderPath,
      filePath: saved.filePath,
    });

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── TEMPLATE CONFIGURATOR ────────────────────────────────────────
// Get template configurator page
app.get('/configurator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'configurator.html'));
});

// Parse template and extract structure
app.get('/api/parse-template', (req, res) => {
  try {
    const templatePath = path.join(__dirname, 'FM1010_template.docx');
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: 'Template file not found' });
    }
    const buffer = fs.readFileSync(templatePath);
    const result = parseTemplate(buffer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available data fields
app.get('/api/available-fields', (req, res) => {
  res.json({ fields: availableFields });
});

// Get current template mapping
app.get('/api/template-mapping', (req, res) => {
  try {
    const mappingPath = path.join(__dirname, 'template-mapping.json');
    if (fs.existsSync(mappingPath)) {
      const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      res.json(mapping);
    } else {
      res.json({ tables: {} });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save template mapping
app.post('/api/save-template-mapping', (req, res) => {
  try {
    const mapping = req.body;
    const mappingPath = path.join(__dirname, 'template-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    res.json({ success: true, message: 'Template mapping saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  STG FAI Generator running at http://localhost:${PORT}`);
  console.log(`  Open this URL in your browser to start creating FAIs`);
  console.log(`  Template Configurator: http://localhost:${PORT}/configurator\n`);
});
