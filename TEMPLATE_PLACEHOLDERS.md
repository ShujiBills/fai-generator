# FM 1010 AS9102 Rev C Template - Placeholder Map

This guide shows where to add placeholders in the Word template for automatic data filling.

## FORM 1 - PART NUMBER ACCOUNTABILITY

Replace the empty cells next to these labels with the corresponding placeholders:

| Label | Placeholder | Example Value |
|-------|-------------|---|
| 1. Part Number: | `{{partNumber}}` | SG8892-001 |
| 2. Part Name: | `{{partName}}` | SSUL Assembly |
| 3. Serial Number: | `{{serialNumber}}` | SN-2026-0512 |
| 4. FAIR Identifier: | `{{fairId}}` | FAI-112 |
| 5. Part Revision Level: | `{{partRev}}` | G |
| 6. Drawing Number: | `{{drawingNumber}}` | SG8892 |
| 7. Drawing Revision Level: | `{{drawingRev}}` | G |
| 8. Additional Changes: | `{{additionalChanges}}` | N/A |
| 9. Manufacturing Process Reference: | `{{mfgProcessRef}}` | Spec 4006 / WO# 23999 |
| 10. Organization Name: | `{{orgName}}` | STG AEROSPACE, INC. |
| 11. Supplier Code: | `{{supplierCode}}` | STGAERO |
| 12. P.O. Number: | `{{poNumber}}` | K26115-P2M |
| 14. Baseline Part Number | `{{baselinePart}}` | SG8892-001 Rev G |
| 14. Reason for Full/Partial FAI: | `{{fairReason}}` | Relocation of manufacturing facilities |
| 20. FAIR verified by: | `{{verifiedBy}}` | Brad Thompson |
| 21. Date: | `{{verifiedDate}}` | 2026-06-02 |
| 22. FAIR Reviewed / Approved by: | `{{approvedBy}}` | V. Gopal |
| 23. Date: | `{{approvedDate}}` | 2026-06-02 |
| 26. Comments: | `{{comments}}` | Prototype run successful... |

### Checkboxes (Field 13 & 14)
For checkboxes, use conditional display or manual marking:
- Detail Part checkbox: Mark with ☑ or ☐ based on `{{isDetail}}`
- Assembly FAI checkbox: Mark with ☑ or ☐ based on `{{isAssembly}}`
- Full FAI checkbox: Mark with ☑ or ☐ based on `{{isFullFai}}`
- Partial FAI checkbox: Mark with ☑ or ☐ based on `{{isPartialFai}}`

### INDEX Section (Fields 15-18)
For the sub-assembly index table, use the loop syntax:

```
{#index}
| 15. {{index.partNumber}} | 16. {{index.partName}} | 17. {{index.partType}} | 18. {{index.fairId}} |
{/index}
```

---

## FORM 2 - PRODUCT ACCOUNTABILITY

| Label | Placeholder | Example Value |
|-------|-------------|---|
| 1. Part Number: | `{{partNumber}}` | SG8892-001 |
| 2. Part Name: | `{{partName}}` | SSUL Assembly |
| 3. Serial Number: | `{{serialNumber}}` | SN-2026-0512 |
| 4. FAIR Identifier: | `{{fairId}}` | FAI-112 |
| 11. Functional Test Procedure Number: | `{{funcTestProc}}` | Spec 4006 |
| 12. Acceptance Report Number: | `{{funcTestResult}}` | WO 23999 |
| 13. Comments: | `{{comments}}` | N/A |

### Materials Table (Fields 5-10)
For material rows, use the loop syntax:

```
{#materials}
| 5. {{materials.name}} | 6. {{materials.spec}} | 7. {{materials.code}} | 8. {{materials.supplier}} | 9. {{materials.custApproval}} | 10. {{materials.cocNumber}} |
{/materials}
```

---

## FORM 3 - CHARACTERISTIC ACCOUNTABILITY

| Label | Placeholder | Example Value |
|-------|-------------|---|
| 1. Part Number: | `{{partNumber}}` | SG8892-001 |
| 2. Part Name: | `{{partName}}` | SSUL Assembly |
| 3. Serial Number: | `{{serialNumber}}` | SN-2026-0512 |
| 4. FAIR Identifier: | `{{fairId}}` | FAI-112 |
| 12. Signature: | `{{verifiedBy}}` | Brad Thompson |
| 13. Date: | `{{verifiedDate}}` | 2026-06-02 |

### Characteristics Table (Fields 5-12)
For characteristic rows, use the loop syntax:

```
{#characteristics}
| 5. {{characteristics.charNo}} | 6. {{characteristics.loc}} | 7. {{characteristics.designator}} | 8. {{characteristics.req}} | 9. {{characteristics.result}} | 10. {{characteristics.tooling}} | 11. {{characteristics.ncr}} | 12. {{characteristics.additionalData}} |
{/characteristics}
```

---

## How to Edit in Word

1. Open `FM 1010 AS9102 Rev C FAI Report.docx` in Microsoft Word
2. For each field above, click in the empty cell next to the label
3. Type the placeholder exactly as shown (e.g., `{{partNumber}}`)
4. Save the file
5. Done! The code will automatically fill these in

## Important Notes

- **Use double curly braces**: `{{fieldName}}` not `{fieldName}`
- **Match case exactly**: `{{partNumber}}` not `{{partnumber}}`
- **For tables with multiple rows**: Use the loop syntax `{#array}...{/array}`
- **Leave label cells unchanged**: Only change the value cells
- **Checkboxes**: We'll handle these with conditional logic in the code
