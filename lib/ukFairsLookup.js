// UK FAIRs Connector
// Searches archived UK FAI records for part/FAIR number cross-references
const fs = require('fs');
const path = require('path');

const UK_FAIRS_ROOT = 'Q:\\UK FAIRs';
const SEARCH_FOLDERS = [
  'CWMBRAN FAIRs',
  'SWAFFHAM FAIRs',
  'FAIRs scanned by Transmedia (Swaffham files)',
  'SUPPLIERS FAIRs',
  '2011',
  'Customer signed & accepted',
  'Oxy from Inc'
];

// Find FAIRs by FAIR number
function findFairByNumber(fairNumber) {
  const results = [];

  try {
    const cleanFair = String(fairNumber).toUpperCase().replace(/[^0-9]/g, '');

    for (const folder of SEARCH_FOLDERS) {
      const folderPath = path.join(UK_FAIRS_ROOT, folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath, { withFileTypes: true, recursive: true })
        .filter(f => !f.isDirectory() && f.name.toLowerCase().endsWith('.pdf'));

      for (const file of files) {
        const fileNameClean = file.name.toUpperCase().replace(/[^0-9A-Z]/g, '');

        // Match FAIR number in filename
        if (fileNameClean.includes('FAIR' + cleanFair) || file.name.match(new RegExp(`FAIR[\\s-]*${cleanFair}`, 'i'))) {
          // Extract metadata from filename
          const fairMatch = file.name.match(/FAIR[\\s-]*(\d+)/i);
          const extractedFair = fairMatch ? fairMatch[1] : cleanFair;

          // Extract part number (various formats)
          const partMatch = file.name.match(/([A-Z0-9]{2,3}[-]?\d{4,5}[-]?\w*)/);
          const partNumber = partMatch ? partMatch[1] : null;

          // Extract revision
          const revMatch = file.name.match(/REV[\\s-]*([A-Z0-9]+)/i);
          const revision = revMatch ? revMatch[1] : null;

          results.push({
            fairNumber: `FAIR-${extractedFair}`,
            fileName: file.name,
            partNumber,
            revision,
            location: folder,
            path: path.dirname(file.parentPath ? path.join(file.parentPath, file.name) : path.join(folderPath, file.name)),
            fullPath: path.join(folderPath, file.name)
          });
        }
      }
    }
  } catch (err) {
    console.error('Error searching FAIRs by number:', err.message);
  }

  return {
    found: results.length > 0,
    fairs: results
  };
}

// Find FAIRs by part number
function findFairsByPartNumber(partNumber) {
  const results = [];

  try {
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const folder of SEARCH_FOLDERS) {
      const folderPath = path.join(UK_FAIRS_ROOT, folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath, { withFileTypes: true, recursive: true })
        .filter(f => !f.isDirectory() && f.name.toLowerCase().endsWith('.pdf'));

      for (const file of files) {
        const fileNameClean = file.name.toUpperCase().replace(/[-\s]/g, '');

        // Match part number in filename
        if (fileNameClean.includes(cleanPartNum)) {
          // Extract FAIR number
          const fairMatch = file.name.match(/FAIR[\\s-]*(\d+)/i);
          const fairNumber = fairMatch ? fairMatch[1] : null;

          // Extract revision
          const revMatch = file.name.match(/REV[\\s-]*([A-Z0-9]+)/i);
          const revision = revMatch ? revMatch[1] : null;

          // Extract status if present (FAILED, ACCEPTED, etc.)
          const statusMatch = file.name.match(/(FAILED|ACCEPTED|PASSED)/i);
          const status = statusMatch ? statusMatch[1] : null;

          results.push({
            fairNumber: fairNumber ? `FAIR-${fairNumber}` : 'Unknown',
            fileName: file.name,
            partNumber,
            revision,
            status,
            location: folder,
            path: path.dirname(file.parentPath ? path.join(file.parentPath, file.name) : path.join(folderPath, file.name)),
            fullPath: path.join(folderPath, file.name)
          });
        }
      }
    }

    // Sort by FAIR number (most recent first if numeric)
    results.sort((a, b) => {
      const aNum = parseInt(a.fairNumber.replace(/[^0-9]/g, '')) || 0;
      const bNum = parseInt(b.fairNumber.replace(/[^0-9]/g, '')) || 0;
      return bNum - aNum;
    });
  } catch (err) {
    console.error('Error searching FAIRs by part number:', err.message);
  }

  return {
    found: results.length > 0,
    fairs: results
  };
}

// Main function: lookup UK FAIR records
async function lookupUkFairsData(fairNumber, partNumber) {
  if (fairNumber) {
    // Look up by FAIR number
    const { found, fairs } = findFairByNumber(fairNumber);

    if (!found) {
      return {
        found: false,
        fairNumber,
        message: `No UK FAIR records found for FAIR ${fairNumber}.`
      };
    }

    return {
      found: true,
      searchType: 'By FAIR Number',
      fairNumber,
      recordsCount: fairs.length,
      records: fairs.slice(0, 10)
    };
  }

  if (partNumber) {
    // Look up by part number
    const { found, fairs } = findFairsByPartNumber(partNumber);

    if (!found) {
      return {
        found: false,
        partNumber,
        message: `No UK FAIR records found for part ${partNumber}. This may be the first FAI for this part.`
      };
    }

    return {
      found: true,
      searchType: 'By Part Number',
      partNumber,
      previousFairsCount: fairs.length,
      records: fairs.slice(0, 10),
      note: `Found ${fairs.length} previous FAIR(s) for this part. Use for historical reference and traceability.`
    };
  }

  return {
    found: false,
    message: 'Either fairNumber or partNumber parameter required'
  };
}

module.exports = { lookupUkFairsData };
