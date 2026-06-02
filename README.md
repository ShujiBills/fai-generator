# STG Aerospace FAI Generator

**AS9102 Rev C First Article Inspection (FAI) Report Auto-Generator with Template Configurator**

A professional web-based tool for generating FAI documents with automatic form field population, eliminating manual data entry and template editing.

---

## ✨ Features

### 🎯 Core Capabilities
- **Template-Based Generation** — Uses FM 1010 AS9102 Rev C official forms
- **Visual Field Mapping** — Click-to-configure data field assignments (no code needed)
- **Auto-Population** — Maps fill in automatically from form submissions
- **20+ Fields Mapped** — All essential FAI data fields ready to use
- **Multiple Forms Support** — Forms 1, 2, and 3 (Part Accountability, Materials, Characteristics)
- **Q: Drive Integration** — Auto-saves to `Q:\USA TXS\20X. FAI's and Log\WIP FAI\`
- **FAI Log Updates** — Automatically records FAI entries in log file
- **WO Batch Lookup** — Retrieves batch numbers from work order picking lists

### 🛠️ Developer Features
- **REST API** — Generate documents programmatically
- **Template Parser** — Extracts and analyzes DOCX structure
- **Mapping System** — JSON-based field-to-cell configuration
- **Extensible Architecture** — Easy to add new fields or forms
- **Version Controlled** — Full git history with meaningful commits

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- FM 1010 AS9102 Rev C template (included)

### Installation

```bash
# Clone the repository
git clone https://github.com/ShujiBills/fai-generator.git
cd fai-generator

# Install dependencies
npm install

# Start the server
node server.js
```

The application will start at `http://localhost:3000`

---

## 📖 Usage

### Option A: Web Form Interface

1. **Open the Form**
   ```
   http://localhost:3000
   ```

2. **Fill Out the 7-Step Form**
   - Step 1: FAIR Identity (Part #, Serial #, etc.)
   - Step 2: Drawing & Manufacturing Info (WO#, PO#, etc.)
   - Step 3: FAI Type & Reason (Full vs Partial)
   - Step 4: Measured Dimensions (auto-loaded by part family)
   - Step 5: Sub-Assembly Index
   - Step 6: Materials & Batch Numbers
   - Step 7: Sign-off (verified by, approved by, dates)

3. **Generate Document**
   - Click "Generate FAI Document"
   - Document auto-saves to Q: drive
   - FAI Log automatically updates

### Option B: REST API

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "fairId": "FAI-115",
    "partNumber": "SG8892-001",
    "partName": "SSUL Assembly",
    "serialNumber": "SN-2026-0601",
    "partRev": "G",
    "drawingNumber": "SG8892",
    "drawingRev": "G",
    "woNumber": "23999",
    "poNumber": "K26115-P2M",
    "verifiedBy": "John Doe",
    "verifiedDate": "2026-06-02",
    "approvedBy": "Jane Smith",
    "approvedDate": "2026-06-02",
    "comments": "Test comment"
  }'
```

---

## ⚙️ Configuration

### Template Configurator

The Template Configurator allows you to map form fields to document cells without code:

1. **Open Configurator**
   ```
   http://localhost:3000/configurator
   ```

2. **Load Template**
   - Click "Load Template"
   - All table cells are displayed

3. **Map Fields**
   - Click any cell in the template
   - Select a data field from the dropdown
   - Click "Assign"
   - Repeat for all needed fields

4. **Save Mapping**
   - Click "💾 Save Mapping"
   - Mapping is saved as `template-mapping.json`
   - All future documents use this mapping

### Adding New Fields

To add a new mappable field:

1. **Open Configurator** and map the cell
2. **Or edit** `template-mapping.json` directly:

```json
{
  "tables": {
    "0": {
      "0": {
        "0": "partNumber",
        "1": "partName"
      }
    }
  }
}
```

---

## 📁 Project Structure

```
fai-generator/
├── server.js                 # Express.js server & API routes
├── package.json              # Dependencies
├── public/
│   ├── index.html           # Main FAI form UI
│   └── configurator.html    # Template configuration UI
├── lib/
│   ├── generate.js          # Document generation engine
│   ├── templateParser.js    # DOCX structure extraction
│   ├── families.js          # Part family definitions
│   ├── fairLog.js           # FAI log management
│   └── batchLookup.js       # WO batch lookup
├── FM1010_template.docx     # Official AS9102 template
├── template-mapping.json    # Field-to-cell mappings
└── TEMPLATE_PLACEHOLDERS.md # Field mapping guide
```

---

## 🔌 API Endpoints

### GET Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /next-fair-id` | Get suggested next FAIR number |
| `GET /api/lookup-wo` | Look up batch numbers from WO |
| `GET /api/available-fields` | List all mappable data fields |
| `GET /api/parse-template` | Extract template structure |
| `GET /api/template-mapping` | Get current field mappings |

### POST Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /generate` | Generate FAI document from form data |
| `POST /api/save-template-mapping` | Save field-to-cell mappings |

---

## 📊 Supported Part Families

The system comes with predefined templates for these part families:

- **SG9904** — SuperSeal Track Assembly
- **SG9904_ANGLE** — SuperSeal Track Assembly (Angled)
- **SG8924** — Assembly SuperSeal Ultralite
- **SG8854** — SSUL Assembly
- **SG8892** — SSUL Assembly
- **SG8826** — SuperSeal Lite Track Assembly
- **SG8844** — SuperSeal Lite Track Assembly
- **15-00013** — 18" LRU Assembly
- **10-00017** — Enhanced 18" LRU Assembly
- **10-00012** — Classic 36" LRU Assembly HB
- **OTHER** — Default family (customizable)

Each family includes:
- Auto-filled part name and drawing info
- Predefined sub-assembly index
- Material specifications
- Dimension measurement fields

---

## 🔄 Workflow

```
User fills form
    ↓
Submits via web interface
    ↓
Server receives data
    ↓
Loads FM 1010 template
    ↓
Applies field mappings
    ↓
Injects data into cells
    ↓
Generates DOCX buffer
    ↓
Saves to Q: drive
    ↓
Updates FAI Log
    ↓
Returns success response
    ↓
Ready for user review/signature
```

---

## 🛠️ Technology Stack

- **Backend:** Node.js + Express.js
- **Document Processing:** docxtemplater, pizzip, fast-xml-parser
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **File Format:** DOCX (Office Open XML)
- **Storage:** Q: drive (Windows file share)

---

## 📝 Mapped Fields

### Form 1 (Part Number Accountability)
- Part Number, Part Name, Serial Number, FAIR ID
- Part Revision, Drawing Number, Drawing Revision, Additional Changes
- Manufacturing Process Ref, Organization, Supplier Code, PO Number
- Assembly/Detail checkbox, Full/Partial FAI checkbox
- FAIR Verified By, Verification Date
- FAIR Approved By, Approval Date
- Comments

### Form 2 (Materials)
- Part Number, Part Name, Serial Number, FAIR ID
- Functional Test Procedure, Acceptance Report Number

### Form 3 (Characteristics)
- Part Number, Part Name, Serial Number, FAIR ID

**Total: 20+ fields configured and ready to use**

---

## 🚀 Deployment

### Local Development
```bash
npm install
node server.js
```

### Production
```bash
npm install --production
NODE_ENV=production node server.js
```

### Windows Service
Use tools like `nssm` or `pm2` to run as a Windows service:
```bash
npm install -g pm2
pm2 start server.js --name "fai-generator"
pm2 startup
pm2 save
```

---

## 📚 Additional Resources

- **Template Mapping Guide:** See `TEMPLATE_PLACEHOLDERS.md` for detailed field reference
- **Template Configurator:** `http://localhost:3000/configurator` — Visual field mapping tool
- **AS9102 Standard:** [FAA AC 20-171B](https://www.faa.gov/regulations_policies/advisory_circulars/)

---

## 🤝 Contributing

To add support for new part families or forms:

1. **Edit** `lib/families.js` to add part definitions
2. **Update** `lib/generate.js` if form structure changes
3. **Test** via web form or API
4. **Commit** with meaningful message
5. **Push** to GitHub

---

## 📄 License

Internal STG Aerospace tool. All rights reserved.

---

## 👤 Author

Kevin Philman  
STG Aerospace, Inc.  
kevin.philman@stgaerospace.com

---

## 📅 Version History

**v1.0.0** (2026-06-02)
- ✅ Template Configurator implementation
- ✅ 20+ fields mapped for Forms 1-3
- ✅ Visual field mapping UI
- ✅ Q: drive integration
- ✅ FAI Log updates
- ✅ REST API

---

## ✅ System Status

- **Server:** Running at http://localhost:3000
- **Template:** FM 1010 AS9102 Rev C loaded
- **Configurator:** Active at http://localhost:3000/configurator
- **GitHub:** https://github.com/ShujiBills/fai-generator
- **Production Ready:** ✅ Yes
