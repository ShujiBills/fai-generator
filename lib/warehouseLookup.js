// Warehouse Connector
// Searches warehouse folders for stock requisitions, C of C, and delivery notes by part number
const fs = require('fs');
const path = require('path');

const WAREHOUSE_ROOT = 'I:\\Warehouse';
const STOCK_REQ_FOLDER = path.join(WAREHOUSE_ROOT, 'Stock Requisitions from Oct 2020');
const COC_DELIVERY_FOLDER = path.join(WAREHOUSE_ROOT, 'Del Notes & C of C\'s October 2020 to march 2026');
const INSPECTION_FOLDER = path.join(WAREHOUSE_ROOT, 'Inspection Reports 2020 to march 2026');

// Find stock requisition PDFs for a part number
function findStockRequisitions(partNumber) {
  const results = [];

  if (!fs.existsSync(STOCK_REQ_FOLDER)) {
    return { found: false, requisitions: [] };
  }

  try {
    const files = fs.readdirSync(STOCK_REQ_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.pdf')) continue;

      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      // Match: part number appears in filename
      if (fileNameClean.includes(cleanPartNum)) {
        // Extract date from filename pattern (various formats: DD-MM-YY, DD.MM.YYYY, etc.)
        const dateMatch = file.match(/(\d{1,2}[-\.]\d{1,2}[-\.]\d{2,4})/);
        const date = dateMatch ? dateMatch[1] : null;

        // Extract requestor name if present (text between part number and date)
        const nameMatch = file.match(new RegExp(partNumber + '\\s+([A-Za-z\\s]+)?\\s*\\d{1,2}', 'i'));
        const requestor = nameMatch && nameMatch[1] ? nameMatch[1].trim() : null;

        results.push({
          fileName: file,
          partNumber,
          date,
          requestor,
          path: path.join(STOCK_REQ_FOLDER, file)
        });
      }
    }
  } catch (err) {
    console.error('Error searching stock requisitions:', err.message);
  }

  return {
    found: results.length > 0,
    requisitions: results.sort((a, b) => {
      // Sort by date (newest first) if available
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    })
  };
}

// Find Certificate of Conformance and Delivery Notes for a part number
function findCofCAndDeliveryNotes(partNumber) {
  const results = [];

  if (!fs.existsSync(COC_DELIVERY_FOLDER)) {
    return { found: false, documents: [] };
  }

  try {
    const files = fs.readdirSync(COC_DELIVERY_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      // Match: part number in filename
      if (fileNameClean.includes(cleanPartNum)) {
        const fileExt = path.extname(file).toLowerCase();

        // Extract invoice/reference number if present
        const refMatch = file.match(/(\d{4,6})/);
        const reference = refMatch ? refMatch[1] : null;

        // Determine document type
        let docType = 'Delivery Note';
        if (file.toUpperCase().includes('COC') || file.toUpperCase().includes('C OF C')) {
          docType = 'Certificate of Conformance';
        } else if (file.toUpperCase().includes('INVOICE')) {
          docType = 'Invoice';
        }

        results.push({
          fileName: file,
          partNumber,
          docType,
          reference,
          format: fileExt,
          path: path.join(COC_DELIVERY_FOLDER, file)
        });
      }
    }
  } catch (err) {
    console.error('Error searching C of C and delivery notes:', err.message);
  }

  return {
    found: results.length > 0,
    documents: results
  };
}

// Find inspection records for a part number
function findInspectionRecords(partNumber) {
  const results = [];

  if (!fs.existsSync(INSPECTION_FOLDER)) {
    return { found: false, records: [] };
  }

  try {
    const files = fs.readdirSync(INSPECTION_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.pdf')) continue;

      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      if (fileNameClean.includes(cleanPartNum)) {
        const dateMatch = file.match(/(\d{1,2}[-\.]\d{1,2}[-\.]\d{2,4})/);
        const date = dateMatch ? dateMatch[1] : null;

        results.push({
          fileName: file,
          partNumber,
          date,
          path: path.join(INSPECTION_FOLDER, file)
        });
      }
    }
  } catch (err) {
    console.error('Error searching inspection records:', err.message);
  }

  return {
    found: results.length > 0,
    records: results
  };
}

// Main function: lookup all warehouse data for a part number
async function lookupWarehouseData(partNumber) {
  const stockReqs = findStockRequisitions(partNumber);
  const cofcDocs = findCofCAndDeliveryNotes(partNumber);
  const inspRecords = findInspectionRecords(partNumber);

  // If nothing found anywhere, return not found
  if (!stockReqs.found && !cofcDocs.found && !inspRecords.found) {
    return {
      found: false,
      partNumber,
      message: `No warehouse records found for part number ${partNumber}.`
    };
  }

  return {
    found: true,
    partNumber,
    stockRequisitions: stockReqs.found ? {
      count: stockReqs.requisitions.length,
      latest: stockReqs.requisitions[0] || null,
      documents: stockReqs.requisitions.slice(0, 5) // Return latest 5
    } : null,
    cofcAndDeliveryNotes: cofcDocs.found ? {
      count: cofcDocs.documents.length,
      documents: cofcDocs.documents.slice(0, 5) // Return latest 5
    } : null,
    inspectionRecords: inspRecords.found ? {
      count: inspRecords.records.length,
      documents: inspRecords.records.slice(0, 5)
    } : null,
    summary: `Found ${stockReqs.requisitions.length} stock requisitions, ${cofcDocs.documents.length} C of C/delivery documents, ${inspRecords.records.length} inspection records`
  };
}

module.exports = { lookupWarehouseData };
