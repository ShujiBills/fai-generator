// Test Results Connector
// Searches D30 test results for ATP, Calibration, and Configuration data
const fs = require('fs');
const path = require('path');

const TEST_RESULTS_ROOT = 'O:\\Testing\\Engineering Testing\\LiteMood\\Addison\\D30 Test\\D30 Test Results STTE_ID2';
const ATP_FOLDER = path.join(TEST_RESULTS_ROOT, 'ATP');
const CALIBRATION_FOLDER = path.join(TEST_RESULTS_ROOT, 'CALIBRATION');
const CONFIGURATION_FOLDER = path.join(TEST_RESULTS_ROOT, 'CONFIGURATION');

// Parse timestamp from filename (e.g., "_02Dec2024_14-48-49_")
function parseTimestamp(filename) {
  const match = filename.match(/_(\d{2})([A-Za-z]{3})(\d{4})_(\d{2})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, day, month, year, hour, min, sec] = match;
  return {
    raw: `${day}${month}${year} ${hour}:${min}:${sec}`,
    sortDate: new Date(`${month} ${day}, ${year} ${hour}:${min}:${sec}`)
  };
}

// Check if test passed or failed
function testStatus(filename) {
  return filename.toUpperCase().includes('FAIL') ? 'FAIL' : 'PASS';
}

// Find ATP test results
function findAtpResults() {
  const results = [];

  if (!fs.existsSync(ATP_FOLDER)) {
    return { found: false, tests: [] };
  }

  try {
    const files = fs.readdirSync(ATP_FOLDER);

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.csv')) continue;

      const timestamp = parseTimestamp(file);
      if (!timestamp) continue;

      const status = testStatus(file);

      results.push({
        fileName: file,
        testType: 'ATP',
        status,
        timestamp: timestamp.raw,
        sortDate: timestamp.sortDate,
        path: path.join(ATP_FOLDER, file)
      });
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.sortDate - a.sortDate);
  } catch (err) {
    console.error('Error searching ATP results:', err.message);
  }

  return {
    found: results.length > 0,
    tests: results
  };
}

// Find Calibration test results
function findCalibrationResults() {
  const results = [];

  if (!fs.existsSync(CALIBRATION_FOLDER)) {
    return { found: false, tests: [] };
  }

  try {
    const files = fs.readdirSync(CALIBRATION_FOLDER);

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.csv')) continue;

      const timestamp = parseTimestamp(file);
      if (!timestamp) continue;

      const status = testStatus(file);

      results.push({
        fileName: file,
        testType: 'CALIBRATION',
        status,
        timestamp: timestamp.raw,
        sortDate: timestamp.sortDate,
        path: path.join(CALIBRATION_FOLDER, file)
      });
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.sortDate - a.sortDate);
  } catch (err) {
    console.error('Error searching Calibration results:', err.message);
  }

  return {
    found: results.length > 0,
    tests: results
  };
}

// Find configuration files for a part number
function findConfigurationForPart(partNumber) {
  const results = [];

  if (!fs.existsSync(CONFIGURATION_FOLDER)) {
    return { found: false, configs: [] };
  }

  try {
    const files = fs.readdirSync(CONFIGURATION_FOLDER);
    const cleanPartNum = String(partNumber).toUpperCase().replace(/[-\s]/g, '');

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.csv')) continue;

      const fileNameClean = file.toUpperCase().replace(/[-\s]/g, '');

      // Match part number in filename
      if (fileNameClean.includes(cleanPartNum)) {
        const timestamp = parseTimestamp(file);

        // Extract configuration type (Ceiling, Window, etc.)
        const configMatch = file.match(/(Ceiling|Window|Aisle|Main|Emergency)_Config/i);
        const configType = configMatch ? configMatch[1] : 'Standard';

        // Extract revision
        const revMatch = file.match(/Rev\s+([A-Z0-9]+)/i);
        const revision = revMatch ? revMatch[1] : null;

        results.push({
          fileName: file,
          partNumber,
          configType,
          revision,
          timestamp: timestamp ? timestamp.raw : null,
          sortDate: timestamp ? timestamp.sortDate : new Date(0),
          path: path.join(CONFIGURATION_FOLDER, file)
        });
      }
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.sortDate - a.sortDate);
  } catch (err) {
    console.error('Error searching configurations:', err.message);
  }

  return {
    found: results.length > 0,
    configs: results
  };
}

// Main function: lookup all test results for D30 lights
async function lookupTestResults(partNumber) {
  const atp = findAtpResults();
  const calibration = findCalibrationResults();
  const config = partNumber ? findConfigurationForPart(partNumber) : { found: false, configs: [] };

  // Get latest test results
  const latestAtp = atp.tests.length > 0 ? atp.tests[0] : null;
  const latestCal = calibration.tests.length > 0 ? calibration.tests[0] : null;

  // If nothing found, return limited info
  if (!atp.found && !calibration.found && !config.found) {
    return {
      found: false,
      partNumber,
      message: 'No test results found. D30 test folder may be empty or not accessible.'
    };
  }

  // Summarize results
  const atpStats = {
    totalTests: atp.tests.length,
    passed: atp.tests.filter(t => t.status === 'PASS').length,
    failed: atp.tests.filter(t => t.status === 'FAIL').length
  };

  const calStats = {
    totalTests: calibration.tests.length,
    passed: calibration.tests.filter(t => t.status === 'PASS').length,
    failed: calibration.tests.filter(t => t.status === 'FAIL').length
  };

  return {
    found: true,
    partNumber,
    atp: atp.found ? {
      ...atpStats,
      latestTest: latestAtp ? {
        status: latestAtp.status,
        timestamp: latestAtp.timestamp,
        fileName: latestAtp.fileName
      } : null,
      recentTests: atp.tests.slice(0, 5)
    } : null,
    calibration: calibration.found ? {
      ...calStats,
      latestTest: latestCal ? {
        status: latestCal.status,
        timestamp: latestCal.timestamp,
        fileName: latestCal.fileName
      } : null,
      recentTests: calibration.tests.slice(0, 5)
    } : null,
    configuration: config.found ? {
      count: config.configs.length,
      configs: config.configs.slice(0, 5)
    } : null,
    summary: {
      overallStatus: (atpStats.failed === 0 && calStats.failed === 0) ? '✅ PASS' : '⚠️ CHECK',
      message: `ATP: ${atpStats.passed}/${atpStats.totalTests} passed | Calibration: ${calStats.passed}/${calStats.totalTests} passed`
    }
  };
}

module.exports = { lookupTestResults };
