# OCR (Optical Character Recognition) System

## Overview

The FAI Generator now includes comprehensive OCR capabilities to extract and read text from PDF documents across all data sources. This enables intelligent document searching beyond filename matching.

## Features

### 1. **Automatic OCR of PDFs**
- All PDF documents are automatically OCR'd when accessed
- Extracted text is cached for performance
- Supports fuzzy matching for OCR errors (O→0, I→1, S→5, etc.)

### 2. **Intelligent Content Search**
- Search documents by part number, even if not in filename
- Extract structured data from documents:
  - Part numbers
  - Batch numbers
  - Revision levels
  - Dates
  - Pass/Fail status

### 3. **Data Sources with OCR**

| Source | Documents | OCR Enabled | Extract Data |
|--------|-----------|-------------|--------------|
| CLS Instructions | 111 PDFs | ✓ | WI numbers, components, procedures |
| Design Data | 2,600+ PDFs | ✓ | Approvals, revisions, change status |
| Warehouse | 185+ PDFs | ✓ | Batch numbers, CoC, dates |
| UK FAIRs | 8,600+ PDFs | ✓ | FAIR numbers, revisions, status |
| Concessions | 600+ PDFs | ✓ | Concession numbers, part refs |
| Work Orders | ∞ PDFs | ✓ | Batch numbers, specifications |

## API Endpoints

### OCR Cache Management

**Get OCR Cache Statistics**
```
GET /api/ocr/stats
```

Returns:
```json
{
  "status": "OCR cache statistics",
  "cachedFiles": 1250,
  "estimatedMemoryMB": 61.24
}
```

**Clear OCR Cache**
```
POST /api/ocr/clear-cache
```

Returns:
```json
{
  "status": "success",
  "message": "OCR cache cleared"
}
```

## How OCR Works

### 1. **PDF Text Extraction**
```javascript
const { extractTextFromPdf } = require('./lib/ocrUtil');

const text = await extractTextFromPdf('/path/to/document.pdf');
// Returns extracted text from PDF
```

### 2. **Part Number Searching**
```javascript
const { findPartNumberInText } = require('./lib/ocrUtil');

const found = findPartNumberInText(pdfText, 'SG8892-001');
// Returns true/false with fuzzy matching for OCR errors
```

### 3. **Data Extraction**
```javascript
const { extractDataFromText } = require('./lib/ocrUtil');

const data = extractDataFromText(pdfText);
// Returns:
// {
//   partNumbers: ['SG8892-001', 'SG8892-002'],
//   batchNumbers: ['21/19488', '22/00123'],
//   revisions: ['A1', 'B'],
//   dates: ['01/15/2026'],
//   status: 'PASS'
// }
```

## Usage Examples

### Example 1: Find Batch Numbers in WO Document

```bash
# Click "WO Batch Numbers" button
# System will:
# 1. Locate WO PDF
# 2. OCR extract text
# 3. Search for "Batch/Serial Number" markers
# 4. Extract batch values with fuzzy matching
# 5. Return batch numbers with source confirmation
```

### Example 2: Verify Part in Historical FAIs

```bash
# Click "Find Previous FAIs" button
# System will:
# 1. Search Q:\UK FAIRs for matching files
# 2. OCR read each PDF to confirm part number match
# 3. Extract FAIR numbers and revisions
# 4. Return only files that actually contain the part
```

### Example 3: Check Design Approvals

```bash
# Click "Design Data & Approvals" button
# System will:
# 1. Find design documents by name and OCR content
# 2. Extract approval dates and statuses
# 3. Identify change control records
# 4. Return relevant engineering data
```

## Performance

### Caching
- **First Access**: Full OCR (1-5 seconds per PDF)
- **Subsequent Accesses**: Instant (from cache)
- **Cache Size**: ~50 KB per document

### Optimization
- Cache survives session restarts (memory-based)
- Clear cache manually via `/api/ocr/clear-cache` if needed
- Monitor cache size with `/api/ocr/stats`

## OCR Accuracy

### Fuzzy Matching Handles
- Letter/number confusion: O↔0, I↔1, S↔5, Z↔2
- Whitespace variations
- Dash/hyphen differences
- Case insensitivity

### Example
```
Searching for: "10-00015-011"
Matches in OCR text:
  ✓ "10-00015-011"      (exact)
  ✓ "10 00015 011"      (spaces)
  ✓ "1O-OOO15-O11"      (OCR errors)
  ✓ "10.00015.011"      (dots)
  ✗ "10-00016-011"      (different part)
```

## Technical Details

### Files Involved

1. **lib/ocrUtil.js** - Core OCR utility
   - `extractTextFromPdf()` - Extract text from PDF
   - `findPartNumberInText()` - Search with fuzzy matching
   - `extractDataFromText()` - Parse structured data
   - `batchOcrFiles()` - Batch process multiple files
   - `clearOcrCache()` - Clear cached results
   - `getOcrCacheStats()` - Get cache information

2. **Updated Connectors**
   - lib/clsLookup.js
   - lib/warehouseLookup.js
   - lib/concessionsLookup.js
   - lib/designDataLookup.js
   - lib/ukFairsLookup.js

3. **API Server**
   - /api/ocr/stats - Cache statistics
   - /api/ocr/clear-cache - Clear cached results

## Future Enhancements

- [ ] Image-based OCR (JPG, PNG, TIFF)
- [ ] Multi-language support
- [ ] Handwriting recognition
- [ ] Document classification
- [ ] Machine learning confidence scoring
- [ ] Background OCR indexing

## Troubleshooting

### OCR Not Working
1. Check OCR tool exists: `tools/ocr-pdf.js`
2. Verify tesseract.js is installed: `npm list tesseract.js`
3. Check PDF file permissions
4. Review server console for error messages

### Slow Lookups
1. Check cache size: `/api/ocr/stats`
2. Clear cache if needed: `POST /api/ocr/clear-cache`
3. Limit search scope (fewer files to OCR)

### Memory Issues
1. Clear OCR cache regularly
2. Limit max pages per PDF
3. Restart server to reset memory

## API Usage

```bash
# Check OCR cache
curl http://localhost:3000/api/ocr/stats

# Clear OCR cache
curl -X POST http://localhost:3000/api/ocr/clear-cache

# Use any lookup endpoint - OCR happens automatically
curl http://localhost:3000/api/lookup-cls?partNumber=D20-1327
curl http://localhost:3000/api/lookup-warehouse?partNumber=10-00015-011
curl http://localhost:3000/api/lookup-design-data?partNumber=10-50013
```

---

**Status**: ✅ OCR system fully integrated and operational
