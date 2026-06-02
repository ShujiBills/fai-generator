const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FAI_BASE = 'Q:/USA TXS/20X. FAI\'s and Log';
const LOG_PATH = path.join(FAI_BASE, 'FAI Log.xlsx');

function getNextFairNumber() {
  // Scan all folders named FAI-NNN in both main and WIP directories
  const dirs = [FAI_BASE, path.join(FAI_BASE, 'WIP FAI')];
  let maxNum = 0;

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(name => {
      const match = name.match(/^FAI-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
  });

  // Also check the log file
  try {
    const wb = xlsx.readFile(LOG_PATH);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    data.slice(2).forEach(row => {
      if (row[0]) {
        const match = String(row[0]).match(/FAI-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
  } catch (e) {
    // log not accessible
  }

  return `FAI-${String(maxNum + 1).padStart(3, '0')}`;
}

function createFairFolder(fairId, partNumber) {
  const folderName = `${fairId} ${partNumber}`;
  const folderPath = path.join(FAI_BASE, 'WIP FAI', folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
}

function saveFairDoc(buffer, fairId, partNumber) {
  const folderPath = createFairFolder(fairId, partNumber);
  const fileName = `${partNumber} ${fairId}.docx`;
  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, buffer);
  return { folderPath, filePath, fileName };
}

function appendToLog(entry) {
  try {
    const wb = xlsx.readFile(LOG_PATH);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

    // Find first empty row after headers
    let insertRow = data.length;
    for (let i = 2; i < data.length; i++) {
      if (!data[i] || !data[i][0]) { insertRow = i; break; }
    }

    // Date as Excel serial number
    const now = new Date();
    const excelDate = Math.floor((now - new Date(1899, 11, 30)) / 86400000);

    xlsx.utils.sheet_add_aoa(ws, [[
      entry.fairId,
      entry.fairType,
      entry.partNumber,
      entry.partName,
      entry.drawingNumber,
      entry.drawingRev,
      entry.woNumber,
      entry.verifiedBy,
      excelDate,
      entry.approvedBy,
      '',
      'N',
    ]], { origin: insertRow });

    xlsx.writeFile(wb, LOG_PATH);
    return true;
  } catch (e) {
    console.error('Could not update FAI Log:', e.message);
    return false;
  }
}

module.exports = { getNextFairNumber, saveFairDoc, appendToLog };
