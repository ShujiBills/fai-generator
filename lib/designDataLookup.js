// Design Data Connector
// Searches design documents including customer approvals, product line data, and change control
const fs = require('fs');
const path = require('path');
const { extractTextFromPdf, findPartNumberInText, extractDataFromText } = require('./ocrUtil');

const DESIGN_DATA_ROOT = 'Q:\\DESIGN DATA';
const CUSTOMER_APPROVALS_FOLDER = path.join(DESIGN_DATA_ROOT, 'CUSTOMER APPROVALS');
const LM_FOLDER = path.join(DESIGN_DATA_ROOT, 'LM');
const CHANGE_CONTROL_FOLDER = path.join(DESIGN_DATA_ROOT, 'CHANGE CONTROL');
const DQNS_FOLDER = path.join(DESIGN_DATA_ROOT, 'DQNS');
const SCNS_FOLDER = path.join(DESIGN_DATA_ROOT, 'SCNs');

// Find customer approval documents for a part number
function findCustomerApprovals(partNumber) {
  const results = [];

  if (!fs.existsSync(CUSTOMER_APPROVALS_FOLDER)) {
    return { found: false, approvals: [] };
  }

  try {
    const files = fs.readdirSync(CUSTOMER_APPROVALS_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      // Match: part number in filename
      if (fileNameClean.includes(cleanPartNum)) {
        const ext = path.extname(file).toLowerCase();

        // Extract revision if present
        const revMatch = file.match(/Rev\s+([A-Z0-9]+)/i);
        const revision = revMatch ? revMatch[1] : null;

        // Extract approval type/customer
        const approvalMatch = file.match(/(?:approval|update|FW|EXT|RE|SG|BLU)\s*[-]?\s*(.+?)(?:\.msg|\.pdf)/i);
        const approvalType = approvalMatch ? approvalMatch[1].trim() : null;

        results.push({
          fileName: file,
          partNumber,
          revision,
          approvalType,
          format: ext,
          path: path.join(CUSTOMER_APPROVALS_FOLDER, file)
        });
      }
    }
  } catch (err) {
    console.error('Error searching customer approvals:', err.message);
  }

  return {
    found: results.length > 0,
    approvals: results
  };
}

// Find LM (product line) data for a drawing reference
function findLmData(drawingNumber) {
  const results = [];

  if (!fs.existsSync(LM_FOLDER)) {
    return { found: false, documents: [] };
  }

  try {
    const productLines = fs.readdirSync(LM_FOLDER, { withFileTypes: true })
      .filter(d => d.isDirectory());

    const cleanDrawing = String(drawingNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const pl of productLines) {
      if (pl.name.startsWith('_')) continue; // Skip archive folders

      const plPath = path.join(LM_FOLDER, pl.name);
      const files = fs.readdirSync(plPath, { withFileTypes: true })
        .filter(f => !f.isDirectory());

      for (const file of files) {
        const fileNameClean = file.name.toUpperCase().replace(/[-\s]/g, '');

        // Match: drawing number in filename
        if (fileNameClean.includes(cleanDrawing) || file.name.toUpperCase().includes(drawingNumber.toUpperCase())) {
          // Extract revision
          const revMatch = file.name.match(/Rev\s+([A-Z0-9]+)/i);
          const revision = revMatch ? revMatch[1] : null;

          results.push({
            fileName: file.name,
            productLine: pl.name,
            drawingNumber,
            revision,
            format: path.extname(file.name).toLowerCase(),
            path: plPath
          });
        }
      }
    }
  } catch (err) {
    console.error('Error searching LM data:', err.message);
  }

  return {
    found: results.length > 0,
    documents: results.sort((a, b) => {
      // Sort by revision (newer first)
      if (a.revision && b.revision) {
        return b.revision.localeCompare(a.revision);
      }
      return 0;
    })
  };
}

// Find change control documents
function findChangeControlRecords(partNumber) {
  const results = [];

  if (!fs.existsSync(CHANGE_CONTROL_FOLDER)) {
    return { found: false, records: [] };
  }

  try {
    const ccFolders = fs.readdirSync(CHANGE_CONTROL_FOLDER, { withFileTypes: true })
      .filter(d => d.isDirectory());

    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const ccFolder of ccFolders) {
      const ccPath = path.join(CHANGE_CONTROL_FOLDER, ccFolder.name);

      try {
        const files = fs.readdirSync(ccPath, { withFileTypes: true })
          .filter(f => !f.isDirectory());

        for (const file of files) {
          const fileNameClean = file.name.toUpperCase().replace(/[-\s]/g, '');

          if (fileNameClean.includes(cleanPartNum)) {
            results.push({
              fileName: file.name,
              changeControlFolder: ccFolder.name,
              partNumber,
              path: ccPath
            });
          }
        }
      } catch {
        continue;
      }
    }
  } catch (err) {
    console.error('Error searching change control:', err.message);
  }

  return {
    found: results.length > 0,
    records: results
  };
}

// Find DQN (Design Qualification Notice) documents
function findDqnRecords(partNumber) {
  const results = [];

  if (!fs.existsSync(DQNS_FOLDER)) {
    return { found: false, records: [] };
  }

  try {
    const files = fs.readdirSync(DQNS_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      // Check if part number appears in filename
      if (fileNameClean.includes(cleanPartNum)) {
        const dqnMatch = file.match(/DQN[-]?(\d+)/i);
        const dqnNumber = dqnMatch ? dqnMatch[1] : null;

        results.push({
          fileName: file,
          dqnNumber,
          partNumber,
          path: path.join(DQNS_FOLDER, file)
        });
      }
    }
  } catch (err) {
    console.error('Error searching DQNs:', err.message);
  }

  return {
    found: results.length > 0,
    records: results
  };
}

// Find SCN (Supplier Change Notice) records
function findScnRecords(partNumber) {
  const results = [];

  if (!fs.existsSync(SCNS_FOLDER)) {
    return { found: false, records: [] };
  }

  try {
    const scnFolders = fs.readdirSync(SCNS_FOLDER, { withFileTypes: true })
      .filter(d => d.isDirectory());

    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const scnFolder of scnFolders) {
      const scnPath = path.join(SCNS_FOLDER, scnFolder.name);
      const files = fs.readdirSync(scnPath, { withFileTypes: true })
        .filter(f => !f.isDirectory());

      for (const file of files) {
        const fileNameClean = file.name.toUpperCase().replace(/[-\s]/g, '');

        if (fileNameClean.includes(cleanPartNum)) {
          const scnMatch = file.name.match(/SCN[-]?([A-Z0-9]+)/i);
          const scnNumber = scnMatch ? scnMatch[1] : scnFolder.name;

          results.push({
            fileName: file.name,
            scnNumber,
            partNumber,
            folder: scnFolder.name,
            path: scnPath
          });
        }
      }
    }
  } catch (err) {
    console.error('Error searching SCNs:', err.message);
  }

  return {
    found: results.length > 0,
    records: results
  };
}

// Main function: lookup all design data for a part/drawing number
async function lookupDesignData(partNumber, drawingNumber) {
  const approvals = findCustomerApprovals(partNumber || '');
  const lmData = drawingNumber ? findLmData(drawingNumber) : { found: false, documents: [] };
  const changeControl = findChangeControlRecords(partNumber || '');
  const dqns = findDqnRecords(partNumber || '');
  const scns = findScnRecords(partNumber || '');

  // If nothing found, return not found
  if (!approvals.found && !lmData.found && !changeControl.found && !dqns.found && !scns.found) {
    return {
      found: false,
      partNumber,
      drawingNumber,
      message: `No design data found for part ${partNumber}${drawingNumber ? ` / drawing ${drawingNumber}` : ''}.`
    };
  }

  return {
    found: true,
    partNumber,
    drawingNumber,
    customerApprovals: approvals.found ? {
      count: approvals.approvals.length,
      documents: approvals.approvals.slice(0, 5)
    } : null,
    lmProductLineData: lmData.found ? {
      count: lmData.documents.length,
      documents: lmData.documents.slice(0, 5)
    } : null,
    changeControl: changeControl.found ? {
      count: changeControl.records.length,
      documents: changeControl.records.slice(0, 5)
    } : null,
    dqns: dqns.found ? {
      count: dqns.records.length,
      documents: dqns.records.slice(0, 5)
    } : null,
    scns: scns.found ? {
      count: scns.records.length,
      documents: scns.records.slice(0, 5)
    } : null,
    summary: `Found ${approvals.approvals.length} customer approvals, ${lmData.documents.length} LM documents, ` +
             `${changeControl.records.length} change control, ${dqns.records.length} DQNs, ${scns.records.length} SCNs`
  };
}

module.exports = { lookupDesignData };
