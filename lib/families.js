// Part family configurations - Form 2 materials and Form 3 characteristics

const FAMILIES = {
  SG9904: {
    name: 'SuperSeal Track Assembly',
    drawingNumber: 'SG9904',
    drawingRev: 'U',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG9952', partName: 'DOUBLE DOT MARKER INSERT', fairId: 'FAIR-0233' },
      { partNumber: '{{STOP_END}}', partName: 'END CAPS', fairId: 'FAIR-1098' },
      { partNumber: 'SG9900', partName: 'SLEEVES', fairId: 'FAIR-2173' },
      { partNumber: 'SG9422', partName: 'PL INSERTS', fairId: 'FAIR-2682' },
    ],
    materials: [
      { name: 'UV CURED ADHESIVE', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG AEROSPACE', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: 'DUNK TEST',
    characteristics: [
      { groupHeader: 'General Notes' },
      { charNo: 2, loc: 'Sheet 1', designator: 'General Notes',
        req: 'Table 1 indicates standard part lengths and codes. When not specifying predetermined single digit length codes -1 through -9, length code is defined with four digits to the hundredth of an inch. (Example: -0750 = 7.500 inches). Maximum possible is 78.74 inches) Requirement: {{LENGTH_REQ}}',
        result: '{{LENGTH}}', tooling: 'Caliper (Asset# STG-4CGN5)', ncr: '', isUserInput: true, label: 'Length (in)', unit: '"' },
      { charNo: 4, loc: 'Sheet 1', designator: 'General Notes',
        req: 'Assembly weight up to 237.5g/m or 2.55 oz/foot.',
        result: '{{WEIGHT}}', tooling: 'Scale (Asset# STG-006)', ncr: '', isUserInput: true, label: 'Weight', unit: 'oz/ft' },
      { charNo: 7, loc: 'Sheet 2', designator: 'General Notes',
        req: 'Per Figure 3, marker inserts are to be placed 0.5” from the a° end of the SG9422 PL insert when used in isolation. Where two marker inserts are used, marker inserts codes A, B and D are to be placed 0.5” from the a° end of the SG9422 PL insert and marker inserts codes C and E 0.5” from the b° end of the PL insert. Where more than two code C or E marker inserts are used, they are to be placed equidistantly throughout the length of the track with the marker inserts on either end 0.5” from the ends of the SG9422 PL insert.',
        result: '{{LABEL_PLACEMENT}}', tooling: 'Caliper (Asset# STG-003)', ncr: '', isUserInput: true, label: 'Marker Placement (in)', unit: '"' },
    ],
  },

  SG9904_ANGLE: {
    name: 'SuperSeal Track Assembly (Angled)',
    drawingNumber: 'SG9904',
    drawingRev: 'U',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG9952', partName: 'DOUBLE DOT MARKER INSERT', fairId: 'FAIR-0233' },
      { partNumber: 'SG9905', partName: 'ANGLED STOP END', fairId: 'FAIR-706' },
      { partNumber: 'SG9900', partName: 'SLEEVES', fairId: 'FAIR-2173' },
      { partNumber: 'SG9422', partName: 'PL INSERTS', fairId: 'FAIR-2682' },
      { partNumber: 'SG9901', partName: 'END CAPS', fairId: 'FAIR-1098' },
    ],
    materials: [
      { name: 'UV CURED ADHESIVE', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG AEROSPACE', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: 'DUNK TEST',
    characteristics: [
      { loc: 'DRAWING', designator: 'REV', req: 'REV U', result: 'PASS', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 1', designator: 'C1', req: 'PROCESS I.A.W 4006', result: 'YES', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 2', designator: 'C1', req: 'CONFORM I.A.W 4006', result: 'YES', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 3', designator: 'C1', req: 'CRIMPING TOOL CRIMPED', result: 'YES', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 4', designator: 'C1', req: 'PART MARKING LABELS', result: 'PASS', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 5', designator: 'C3', req: 'SEAL I.A.W SG1124', result: 'PASS', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'NOTE 6', designator: 'C8', req: 'DUNK TEST I.A.W 4006', result: 'PASS', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'C1 SHEET 1', designator: 'LENGTH', req: 'PER DRAWING +0.08"/-0.00"', result: '{{LENGTH}}', tooling: '4GCN5', ncr: 'N/A', isUserInput: true, label: 'Length (in)', unit: '"' },
      { loc: 'A5/6 SHEET 1', designator: 'A° ANGLE', req: 'PER DRAWING ± 0.5°', result: '{{ANGLE}}', tooling: 'CALIPER', ncr: 'N/A', isUserInput: true, label: 'Angle', unit: '°' },
      { loc: 'NOTE 8', designator: 'C1', req: '237.5g/m OR 2.55oz/foot', result: '{{WEIGHT}}', tooling: 'SCALE', ncr: 'N/A', isUserInput: true, label: 'Weight', unit: 'g/m' },
      { loc: 'NOTE 9', designator: 'C1', req: 'LABEL PLACEMENT 1" FROM EITHER END', result: '{{LABEL_PLACEMENT}}', tooling: 'CALIPER', ncr: 'N/A', isUserInput: true, label: 'Label Placement', unit: 'mm' },
    ],
  },

  SG8924: {
    name: 'Assembly SuperSeal Ultralite',
    drawingNumber: 'SG8924',
    drawingRev: 'F',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG8504-R354', partName: 'Coloured Insert (14.5mm)', fairId: 'FAIR-958' },
      { partNumber: 'SG8851', partName: 'Superseal Ultralite Track Sleeve', fairId: 'FAIR-2159' },
      { partNumber: 'SG8925', partName: 'Photoluminescent Insert Blue Emitting', fairId: 'FAIR-1513' },
      { partNumber: '40-00014-002', partName: '50mm x 12mm Part Mark Label', fairId: '' },
    ],
    materials: [
      { name: 'UV Cured Adhesive', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG Aerospace', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: '4006 – Dunk Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'NOTE 1', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 2', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 3', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 4', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 5', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 6', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 7', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 8', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 9', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 10', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 11', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 12', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 13', req: 'REFERENCE DRAWING SG8924 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: '-', designator: 'LENGTH', req: '2000mm +/- 2.0', result: '{{LENGTH}}', tooling: '4GCN5', ncr: '', isUserInput: true, label: 'Length (mm)', unit: 'mm' },
    ],
  },

  SG8854: {
    name: 'SSUL Assembly',
    drawingNumber: 'SG8854',
    drawingRev: 'F',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG8851', partName: 'Superseal Ultralite Track Sleeve', fairId: '' },
      { partNumber: 'SG8504-', partName: 'Coloured Insert (14.5mm)', fairId: '' },
      { partNumber: '40-00014-002', partName: '50mm x 12mm Part Mark Label', fairId: '' },
    ],
    materials: [
      { name: 'UV Cured Adhesive', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG Aerospace', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: '4006 – Dunk Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'NOTE 1', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 2', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 3', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 4', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 5', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 6', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 7', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 8', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: 'SHEET 1', designator: 'NOTE 9', req: 'REFERENCE DRAWING SG8854 REV F', result: 'VERIFIED', tooling: 'N/A', ncr: '' },
      { loc: '-', designator: 'LENGTH', req: '2000mm +/- 2.0', result: '{{LENGTH}}', tooling: 'CALIPER', ncr: '', isUserInput: true, label: 'Length (mm)', unit: 'mm' },
    ],
  },

  SG8892: {
    name: 'SSUL Assembly',
    drawingNumber: 'SG8892',
    drawingRev: 'G',
    supplierCode: 'U8192',
    isAssembly: true,
    index: [
      { partNumber: 'SG8851', partName: 'Track, Superseal Ultralite', fairId: 'FAIR-2159' },
      { partNumber: 'SG8642', partName: 'Photoluminescent Insert, SSUL', fairId: 'FAIR-3091' },
      { partNumber: 'SG8504-', partName: 'Coloured Insert (14.5mm)', fairId: '' },
      { partNumber: '40-00014-002', partName: '50mm x 12mm Part Mark Label', fairId: 'FAIR-1684' },
      { partNumber: 'POLYKEN 108', partName: 'Adhesive Tape, Double Sided', fairId: 'N/A' },
    ],
    materials: [
      { name: 'Track Sleeve SSUL Coated', spec: 'SG8851 REV C', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'Photoluminescent Insert, SSUL', spec: 'SG8642 REV D', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'Coloured Insert (14.5mm)', spec: 'SG8504 REV L', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'UV Cured Adhesive', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'KRYLEX', custApproval: 'N/A', cocNumber: '' },
      { name: 'Part Mark Label 50 x 12mm', spec: '40-00014-002 REV C1', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'Adhesive Tape, Double Sided', spec: 'POLYKEN 108', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: 'N/A' },
    ],
    funcTestProc: '4006 – Dunk Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'ASSEMBLED LENGTH', req: '2000mm ± 2.00mm', result: '{{LENGTH}}', tooling: '4CGN5', ncr: 'N/A', isUserInput: true, label: 'Assembled Length (mm)', unit: 'mm' },
      { loc: 'SHEET 2', designator: 'WIDTH', req: '18.3mm ±0.20mm', result: '{{WIDTH}}', tooling: 'STG:003', ncr: 'N/A', isUserInput: true, label: 'Width (mm)', unit: 'mm' },
      { loc: 'SHEET 2', designator: 'HEIGHT', req: '4.3mm MAX', result: '{{HEIGHT}}', tooling: 'STG:003', ncr: 'N/A', isUserInput: true, label: 'Height (mm)', unit: 'mm' },
      { loc: 'SHEET 1', designator: 'MASS', req: '90g/m MAX', result: '{{MASS}}', tooling: 'STG:006', ncr: 'N/A', isUserInput: true, label: 'Mass', unit: 'g/m' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'MANUFACTURED I.A.W STG AEROSPACE D/N 4006', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'ALL COMPONENT PARTS CONFORM TO APPROVED DESIGN DOCUMENTATION', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'ALL PARTS MUST BE CLEAN AND FREE FROM DEBRIS AND FOREIGN OBJECTS', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'PL INSERT VISUALLY INSPECTED: NO MARKS/SPOTS >0.5MM, NO OBVIOUS RED FIBERS, INCLUSIONS <0.5MM SQ AND ≤4 PER STRIP', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'LABEL 40-00014-002 APPLIED TO BACK FACE OF INSERT, MIN 25MM FROM END', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'SG8642 PL INSERTS DO NOT OVERLAP WITHIN SG8851 TRACK SLEEVE (CONCAVE/CONVEX)', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'COLOURED INSERT SG8504 ON TOP OF PL INSERT, INSIDE TRACK, WRINKLE FREE', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'SEAL ENDS WITH UV ADHESIVE KRYLEX KU223. PL INSERT FLUSH WITH ENDS (+0.0/-0.50mm). COLOR INSERT TO END OF TRACK.', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'CURE ADHESIVE UNDER UV LIGHT PER D/N 4006. DUNK TEST - NO WATER INGRESS AT EITHER END.', result: 'VERIFIED', tooling: 'DUNK TEST', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'APPLY DOUBLE SIDED ADHESIVE TAPE (POLYKEN 108) ALONG ENTIRE LENGTH', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'NOTE', req: 'PACK IN ACCORDANCE WITH LATEST PROCESS SPECIFICATIONS (STGMS006)', result: 'VERIFIED', tooling: 'VISUAL', ncr: 'N/A' },
    ],
  },

  SG8826: {
    name: 'SuperSeal Lite Track Assembly',
    drawingNumber: 'SG8826-1',
    drawingRev: 'B',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG8500', partName: 'SSL Track Sleeve', fairId: 'FAIR-1252' },
      { partNumber: 'SG8503', partName: 'PL Insert Lite', fairId: 'FAIR-813618' },
      { partNumber: 'SG8504-', partName: 'Colored Insert', fairId: '' },
      { partNumber: 'SG8501', partName: 'SSL Stop End', fairId: 'FAIR-66148' },
    ],
    materials: [
      { name: 'UV Cured Adhesive', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'Label: 50 x 12.7mm', spec: '40-00014', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: '4006 – Dunk Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'ASSEMBLY WEIGHT UP TO 115g/m OR 1.23oz/FOOT', result: '{{WEIGHT}}', tooling: 'STG-006 SCALE', ncr: 'N/A', isUserInput: true, label: 'Weight', unit: 'g/m' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'STANDARD ASSEMBLY LENGTH INCLUDING END CAPS: 78.86" (-0.08"/+0.10"). WIDTH: 0.72" (±0.04"). HEIGHT: 0.2" (±0.04").', result: '{{LENGTH}}', tooling: '4CGN5 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Length (in)', unit: '"' },
    ],
  },

  SG8844: {
    name: 'SuperSeal Lite Track Assembly',
    drawingNumber: 'SG8844',
    drawingRev: 'B',
    supplierCode: 'STGAERO',
    isAssembly: true,
    index: [
      { partNumber: 'SG8500', partName: 'SSL Track Sleeve', fairId: '' },
      { partNumber: 'SG8503', partName: 'PL Insert Lite', fairId: '' },
      { partNumber: 'SG8504-', partName: 'Colored Insert', fairId: '' },
      { partNumber: 'SG8501', partName: 'SSL Stop End', fairId: '' },
    ],
    materials: [
      { name: 'UV Cured Adhesive', spec: 'KRYLEX KU223', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
      { name: 'Label: 50 x 12.7mm', spec: '40-00014', code: 'N/A', supplier: 'STG Aerospace Ltd', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: '4006 – Dunk Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'ASSEMBLY WEIGHT UP TO 115g/m OR 1.23oz/FOOT', result: '{{WEIGHT}}', tooling: 'STG-006 SCALE', ncr: 'N/A', isUserInput: true, label: 'Weight', unit: 'g/m' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'STANDARD ASSEMBLY LENGTH INCLUDING END CAPS: 78.86" (-0.08"/+0.10"). WIDTH: 0.72" (±0.04"). HEIGHT: 0.2" (±0.04").', result: '{{LENGTH}}', tooling: '4CGN5 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Length (in)', unit: '"' },
    ],
  },

  '15-00013': {
    name: '18" LRU Assembly',
    drawingNumber: '15-00013',
    drawingRev: 'C3',
    supplierCode: 'N/A',
    isAssembly: true,
    mfgSpec: 'WI 2127-3',
    index: [
      { partNumber: '70-00041', partName: 'Tray 18" Unit', fairId: 'DM201712011712601' },
      { partNumber: '70-00030', partName: 'Connector End Housing', fairId: 'DM201712011712001' },
      { partNumber: '70-00032', partName: 'Simple End Housing', fairId: 'DM201712011712002' },
      { partNumber: '70-00034-003', partName: 'Lid', fairId: 'ST 70-00034-003' },
      { partNumber: '40-00020', partName: 'Blanking Label', fairId: 'FAIR-1216' },
      { partNumber: '66-00024-001', partName: 'Led Controller', fairId: 'FN018' },
      { partNumber: '66-00023-001', partName: 'IR Board', fairId: 'FN005' },
      { partNumber: '66-00069-001', partName: '18" Led Board', fairId: '92' },
      { partNumber: '66-00025-001', partName: 'IR Screen', fairId: 'FN004' },
      { partNumber: '30-00003-001', partName: 'Mounting Pad', fairId: 'FAIR-1515' },
      { partNumber: '30-00003-002', partName: 'Mounting Pad', fairId: 'FAIR-1516' },
    ],
    materials: [
      { name: 'Tray 18" Unit', spec: '70-00041', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Connector End Housing', spec: '70-00030', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Simple End Housing', spec: '70-00032', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Lid', spec: '70-00034-003', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Blanking Label', spec: '40-00020-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Led Controller', spec: '66-00024-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'IR Board', spec: '66-00023-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: '18" LED Board', spec: '66-00069-001-ASY', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'IR Screen', spec: '66-00025-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Mounting Pad', spec: '30-00003-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Bondplus Electrical Tape', spec: 'HB 830-25', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Mounting Pad', spec: '30-00003-002', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: 'D30-ATP-01',
    characteristics: [
      { loc: 'E6', designator: 'LENGTH', req: '470.6 ±0.25mm', result: '{{LENGTH}}', tooling: '4CGN5 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Length (mm)', unit: 'mm' },
      { loc: 'D8', designator: 'WIDTH', req: '34.4 ±0.25mm', result: '{{WIDTH}}', tooling: 'STG-003 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Width (mm)', unit: 'mm' },
      { loc: 'E8', designator: 'HEIGHT', req: '36.8 ±0.25mm', result: '{{HEIGHT}}', tooling: 'STG-003 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Height (mm)', unit: 'mm' },
      { loc: 'F8', designator: 'WEIGHT', req: '191g', result: '{{MASS}}', tooling: 'STG-006 SCALE', ncr: 'N/A', isUserInput: true, label: 'Weight (g)', unit: 'g' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'TO BE READ IN CONJUNCTION WITH CORRESPONDING BOM. FOR BOM SEE LIST OF VARIANTS', result: 'OK', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'SEE DETAIL A, B & C (SHEET 1) AND DETAIL E & F (SHEET 2) FOR EXTRA ASSEMBLY REQUIREMENTS', result: 'VERIFIED', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'ASSEMBLY TO BE FREE OF FOREIGN OBJECTS AND FINGER PRINTS', result: 'VERIFIED', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'FINISHED ASSEMBLY TO BE TESTED ACCORDING TO D30-ATP-01', result: 'VERIFIED', tooling: 'STTE ID S772', ncr: 'N/A' },
    ],
  },

  '10-00017': {
    name: 'Enhanced 18" LRU Assembly',
    drawingNumber: '10-00017',
    drawingRev: 'C2',
    supplierCode: 'N/A',
    isAssembly: true,
    mfgSpec: 'WI 2127-9',
    index: [
      { partNumber: '15-00013-012', partName: '18" LRU Assembly Hub', fairId: 'FAIR-061' },
      { partNumber: '70-00036', partName: 'Connector Module Upper', fairId: 'DM/RF-QP-11-01' },
      { partNumber: '66-00014-001', partName: 'Connector Board Assy', fairId: 'FN002' },
      { partNumber: '70-00035', partName: 'Connector Module Lower', fairId: 'FAIR-1247' },
      { partNumber: '40-00008-015', partName: 'Airbus liTeMood Placard', fairId: 'FAI-074' },
    ],
    materials: [
      { name: 'Connector Module Upper', spec: '70-00036', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Connector Board Assy', spec: '66-00014-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Connector Module Lower', spec: '70-00035', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: 'D30-ATP-01',
    characteristics: [
      { loc: 'E3', designator: 'LENGTH', req: '470.6 ±0.25mm', result: '{{LENGTH}}', tooling: '4CGN5 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Length (mm)', unit: 'mm' },
      { loc: 'D1', designator: 'WIDTH', req: '34.4 ±0.25mm', result: '{{WIDTH}}', tooling: 'STG-003 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Width (mm)', unit: 'mm' },
      { loc: 'E1', designator: 'HEIGHT', req: '35 ±0.5mm', result: '{{HEIGHT}}', tooling: 'STG-003 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Height (mm)', unit: 'mm' },
      { loc: 'E1', designator: 'HEIGHT WITH CONNECTOR', req: '61.5 ±0.25mm', result: '{{HEIGHT2}}', tooling: 'STG-003 CALIPER', ncr: 'N/A', isUserInput: true, label: 'Height w/ Connector (mm)', unit: 'mm' },
      { loc: 'F8', designator: 'WEIGHT', req: '208g', result: '{{MASS}}', tooling: 'STG-006 SCALE', ncr: 'N/A', isUserInput: true, label: 'Weight (g)', unit: 'g' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'TO BE READ IN CONJUNCTION WITH CORRESPONDING BOM. FOR BOM SEE LIST OF VARIANTS', result: 'OK', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'ASSEMBLY TO BE FREE OF FOREIGN OBJECTS AND FINGERPRINTS', result: 'VERIFIED', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'FINISHED ASSEMBLY TO BE TESTED ACCORDING TO D30-ATP-01', result: 'VERIFIED', tooling: 'STTE ID S772', ncr: 'N/A' },
    ],
  },

  '10-00012': {
    name: 'Classic 36" LRU Assembly HB',
    drawingNumber: '10-00012',
    drawingRev: 'C2',
    supplierCode: 'N/A',
    isAssembly: true,
    mfgSpec: 'WI 2127-4',
    index: [
      { partNumber: '15-00011-012', partName: '36" LRU Assembly HB', fairId: 'FAI-071' },
      { partNumber: '70-00043', partName: 'Classic Connector Bracket', fairId: 'FAIR-1225' },
      { partNumber: '70-00048', partName: 'Classic Connector Bracket Cover', fairId: 'FAIR-1226' },
      { partNumber: '40-00020', partName: 'Blanking Label', fairId: 'FAIR-1216' },
      { partNumber: '40-00008-010', partName: 'Airbus liTeMood Placard', fairId: 'FAI-074' },
    ],
    materials: [
      { name: 'Classic Harness', spec: '35-00010-001', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Classic Connector Bracket', spec: '70-00043', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Cable Tie', spec: '111-01950', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Classic Connector Bracket Cover', spec: '70-00048', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
      { name: 'Cable Clamp', spec: '0017 2023 200', code: 'N/A', supplier: 'STG Aerospace Ltd.', custApproval: 'N/A', cocNumber: '' },
    ],
    funcTestProc: 'ATP Test',
    characteristics: [
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'TO BE READ IN CONJUNCTION WITH CORRESPONDING BOM. FOR BOM SEE LIST OF VARIANTS', result: 'OK', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'ASSEMBLY TO BE FREE OF FOREIGN OBJECTS AND FINGER PRINTS', result: 'VERIFIED', tooling: 'N/A', ncr: 'N/A' },
      { loc: 'SHEET 1', designator: 'GENERAL NOTES', req: 'FINISHED ASSEMBLY TO BE TESTED ACCORDING TO D30-ATP-01', result: 'VERIFIED', tooling: 'STTE ID S772', ncr: 'N/A' },
    ],
  },

  OTHER: {
    name: '',
    drawingNumber: '',
    drawingRev: '',
    supplierCode: 'STGAERO',
    isAssembly: false,
    index: [],
    materials: [],
    funcTestProc: '',
    characteristics: [],
  },
};

function detectFamily(partNumber) {
  const pn = (partNumber || '').toUpperCase();
  if (pn.startsWith('SG9904')) {
    if (/-[TU]-\d/i.test(pn)) return 'SG9904_ANGLE';
    return 'SG9904';
  }
  if (pn.startsWith('SG8924')) return 'SG8924';
  if (pn.startsWith('SG8854')) return 'SG8854';
  if (pn.startsWith('SG8892') || pn.startsWith('SG8829')) return 'SG8892';
  if (pn.startsWith('SG8826')) return 'SG8826';
  if (pn.startsWith('SG8844')) return 'SG8844';
  if (pn.startsWith('15-00013')) return '15-00013';
  if (pn.startsWith('10-00017')) return '10-00017';
  if (pn.startsWith('10-00012')) return '10-00012';
  return 'OTHER';
}

module.exports = { FAMILIES, detectFamily };
