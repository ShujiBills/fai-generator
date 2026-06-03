// Concessions Connector
// Searches concession folders for part number references
const fs = require('fs');
const path = require('path');

const CONCESSIONS_ROOT = 'Q:\\CONCESSIONS';
const CON_RANGES = [
  'CON 001 to 099',
  'CON 100 to 199',
  'CON 200 to 299',
  'CON 300 to 399',
  'CON 400 to 499',
  'CON 500 to 599',
  'CON 600 to 699',
  'CON 700 to 799'
];

// Find concession numbers that might reference a part number
// Searches concession folder names and documents for part number mentions
function findConcessionsForPart(partNumber) {
  const results = [];

  if (!fs.existsSync(CONCESSIONS_ROOT)) {
    return { found: false, concessions: [] };
  }

  const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

  try {
    // Search through each CON range folder
    for (const rangeFolder of CON_RANGES) {
      const rangePath = path.join(CONCESSIONS_ROOT, rangeFolder);
      if (!fs.existsSync(rangePath)) continue;

      const conFolders = fs.readdirSync(rangePath, { withFileTypes: true })
        .filter(d => d.isDirectory());

      for (const conFolder of conFolders) {
        const conPath = path.join(rangePath, conFolder.name);
        const files = fs.readdirSync(conPath, { withFileTypes: true })
          .filter(f => !f.isDirectory());

        for (const file of files) {
          const fileName = file.name.toUpperCase();
          const fileNameClean = fileName.replace(/[-\s]/g, '');

          // Check if part number appears in filename
          if (fileNameClean.includes(cleanPartNum)) {
            // Extract concession number from folder name
            const conMatch = conFolder.name.match(/CON\s*(\d+)/i);
            const conNumber = conMatch ? conMatch[1] : conFolder.name;

            // Extract description from filename
            const descMatch = file.name.match(/CON\s*\d+\s*-\s*(.+?)\.pdf/i);
            const description = descMatch ? descMatch[1].trim() : null;

            results.push({
              conNumber: `CON-${conNumber}`,
              folderName: conFolder.name,
              fileName: file.name,
              description,
              partNumber,
              path: conPath
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error searching concessions:', err.message);
  }

  return {
    found: results.length > 0,
    concessions: results
  };
}

// Find a specific concession by CON number
function findConceptionByNumber(conNumber) {
  const result = {
    found: false,
    conNumber,
    document: null
  };

  if (!fs.existsSync(CONCESSIONS_ROOT)) {
    return result;
  }

  const cleanCon = String(conNumber).replace(/[^0-9]/g, '').padStart(5, '0');
  const conNum = parseInt(cleanCon);

  try {
    // Determine which range folder to search
    let rangeFolders = [];
    if (conNum >= 1 && conNum <= 99) rangeFolders = ['CON 001 to 099'];
    else if (conNum >= 100 && conNum <= 199) rangeFolders = ['CON 100 to 199'];
    else if (conNum >= 200 && conNum <= 299) rangeFolders = ['CON 200 to 299'];
    else if (conNum >= 300 && conNum <= 399) rangeFolders = ['CON 300 to 399'];
    else if (conNum >= 400 && conNum <= 499) rangeFolders = ['CON 400 to 499'];
    else if (conNum >= 500 && conNum <= 599) rangeFolders = ['CON 500 to 599'];
    else if (conNum >= 600 && conNum <= 699) rangeFolders = ['CON 600 to 699'];
    else if (conNum >= 700 && conNum <= 799) rangeFolders = ['CON 700 to 799'];

    for (const rangeFolder of rangeFolders) {
      const rangePath = path.join(CONCESSIONS_ROOT, rangeFolder);
      if (!fs.existsSync(rangePath)) continue;

      // Look for matching CON folder
      const conFolders = fs.readdirSync(rangePath, { withFileTypes: true })
        .filter(d => d.isDirectory());

      for (const conFolder of conFolders) {
        const conMatch = conFolder.name.match(/CON\s*(\d+)/i);
        if (!conMatch) continue;

        const foundNum = parseInt(conMatch[1]);
        if (foundNum === conNum) {
          const conPath = path.join(rangePath, conFolder.name);
          const files = fs.readdirSync(conPath);

          const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
          if (pdfFile) {
            const descMatch = pdfFile.match(/CON\s*\d+\s*-\s*(.+?)\.pdf/i);
            const description = descMatch ? descMatch[1].trim() : null;

            result.found = true;
            result.document = {
              conNumber: `CON-${foundNum}`,
              folderName: conFolder.name,
              fileName: pdfFile,
              description,
              path: conPath
            };
            return result;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error finding concession:', err.message);
  }

  return result;
}

// Main function: lookup concession data
async function lookupConcessionsData(partNumber, conNumber) {
  // If CON number provided, look that up directly
  if (conNumber) {
    const result = findConceptionByNumber(conNumber);
    if (result.found) {
      return {
        found: true,
        searchType: 'By CON Number',
        ...result
      };
    } else {
      return {
        found: false,
        conNumber,
        message: `Concession ${conNumber} not found in Q:\\CONCESSIONS`
      };
    }
  }

  // Otherwise search by part number
  if (!partNumber) {
    return {
      found: false,
      message: 'Either partNumber or conNumber parameter required'
    };
  }

  const { found, concessions } = findConcessionsForPart(partNumber);

  if (!found) {
    return {
      found: false,
      partNumber,
      message: `No concessions found for part number ${partNumber}.`
    };
  }

  return {
    found: true,
    searchType: 'By Part Number',
    partNumber,
    concessionsCount: concessions.length,
    concessions: concessions.slice(0, 10) // Return latest 10
  };
}

module.exports = { lookupConcessionsData };
