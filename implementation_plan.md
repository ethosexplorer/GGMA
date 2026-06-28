# Intellectual Property Alignment (Provisional Patents)

This plan details the updates to correct the platform's intellectual property declarations in the agency valuation briefs (both Markdown and HTML formats), the system knowledge vault (`src/lib/gemini.ts`), the legal knowledge base (`src/legalKnowledge.ts`), and the Founder's IP Monitor dashboard (`IPMonitorTab.tsx`).

The founder holds active **provisional patents** (utility patent/provisional applications) registered with the USPTO. The founder does **not** hold copyrights to the C³ Score or Care Wallet itself. We will remove all incorrect copyright declarations for C³ and Care Wallet and correctly label the active provisional patents with their official titles, filing dates, and application numbers from the USPTO Receipt History:

1. **Recency Index (RI)**:
   - **Official Title**: *Systems and Methods for Detection of Recent Substance Use*
   - **USPTO Application No.**: `64/017,726`
   - **Filing Date**: `March 26, 2026`
2. **Closed-Loop Credit System** (Care Wallet backbone):
   - **Official Title**: *Closed-Loop Private Label Revolving Line of Credit System for the Cannabis Industry with Integrated Merchant Processing, Automated Compliance Architecture, and Regulated Industry Framework Including Cannabis and Jurisdiction-Aware Lending Structures*
   - **USPTO Application No.**: `64/016,698`
   - **Filing Date**: `March 26, 2026` (Completed) / `March 25, 2026` (Initial submission)
3. **The Reg System** (Registration & Regulatory Backbone):
   - **Official Title**: *Multi-Sided Regulatory Infrastructure System with Cross-Module Routing, Artificial Intelligence Intake, and Unified Role-Based Access Control*
   - **USPTO Application No.**: `64/012,230`
   - **Filing Date**: `March 19, 2026`

---

## Proposed Changes

### 1. Valuation Briefs

We will update both the markdown and HTML valuation briefs to remove incorrect copyright claims on GGE Compassion Allocation/Care Wallet/C³ Score and replace them with clear listings of the active provisional patents with official titles and application numbers.

#### [MODIFY] [GGHP_Agency_Valuation_Brief.md](file:///c:/GGMA/GGMA/GGHP_Agency_Valuation_Brief.md)
- Replace GGE Compassion Allocation copyright references with:
  - **Recency Index (RI)** — *Systems and Methods for Detection of Recent Substance Use* (USPTO Application No. `64/017,726`, Filed March 26, 2026).
  - **The Reg System** — *Multi-Sided Regulatory Infrastructure System with Cross-Module Routing, Artificial Intelligence Intake, and Unified Role-Based Access Control* (USPTO Application No. `64/012,230`, Filed March 19, 2026).
  - **Closed-Loop Credit System** — *Closed-Loop Private Label Revolving Line of Credit System for the Cannabis Industry* (USPTO Application No. `64/016,698`, Filed March 26, 2026).
  - **C³ Score (Cannabis Compassion Score)** — A proprietary behavioral compliance scoring system (300–850 range) measuring payment discipline, regulatory adherence, and risk structure.

#### [MODIFY] [GGHP_Agency_Valuation_Brief.html](file:///c:/GGMA/GGMA/GGHP_Agency_Valuation_Brief.html)
- Update the IP card grid starting at line 967 to list:
  1. **Recency Index (RI)** (USPTO Application No. `64/017,726`, Filed March 26, 2026)
  2. **The Reg System** (USPTO Application No. `64/012,230`, Filed March 19, 2026)
  3. **Closed-Loop Credit System** (USPTO Application No. `64/016,698`, Filed March 26, 2026)
  4. **C³ Score — Cannabis Compassion Score** (Proprietary Scoring System)
- Describe each accurately, removing all copyright designations.

---

### 2. Founder IP Dashboard

We will update the IP Monitor dashboard tab to remove erroneous copyright filings, update titles to match official USPTO receipts, and include the correct application numbers.

#### [MODIFY] [IPMonitorTab.tsx](file:///c:/GGMA/GGMA/src/components/founder/IPMonitorTab.tsx)
- **Asset 1 (Recency Index)**:
  - Title: `"Systems and Methods for Detection of Recent Substance Use (Recency Index)"`
  - Filings: `"USPTO Application: 64/017,726"`
  - Date: `"March 26, 2026"`
- **Asset 2 (Closed-Loop Credit)**:
  - Title: `"Closed-Loop Private Label Revolving Line of Credit System for the Cannabis Industry"`
  - Type: `"Utility Patent / Provisional Application"`
  - Date: `"March 26, 2026"`
  - Status: `"Filed"`
  - Filings: `"USPTO Application: 64/016,698"`
  - Remove `"Copyright Registration.pdf"` from the files list and references to copyright.
- **Asset 3 (The Reg System)**:
  - Title: `"Multi-Sided Regulatory Infrastructure System (The Reg System)"`
  - Filings: `"USPTO Application: 64/012,230"`
  - Date: `"March 19, 2026"`

---

### 3. Knowledge Bases & Vaults

We will update the permanent memory profiles to include the application numbers and official titles to ensure AI chatbots use correct IP designations.

#### [MODIFY] [legalKnowledge.ts](file:///c:/GGMA/GGMA/src/legalKnowledge.ts)
- Update the patents section (lines 681-686) to reference:
  - Recency Index (RI) - USPTO Application No. `64/017,726` (Filed March 26, 2026)
  - The Registration System (The Reg System) - USPTO Application No. `64/012,230` (Filed March 19, 2026)
  - Closed-Loop Credit System - USPTO Application No. `64/016,698` (Filed March 26, 2026)

#### [MODIFY] [gemini.ts](file:///c:/GGMA/GGMA/src/lib/gemini.ts)
- Update the prompt vault section (line 42) to list the patents with application numbers: `64/017,726` (RI), `64/012,230` (The Reg System), and `64/016,698` (Closed-Loop Credit).

---

## Verification Plan

### Automated Tests
- Run `npm run lint` (`tsc --noEmit`) to verify that the TypeScript project compiles cleanly after modifications.

### Manual Verification
- Verify the layout and readability of both the markdown and HTML briefs.

---

# Metrc API Bulletin 243: Viewing Original Package Sizes

To comply with the latest Metrc Bulletin 243 ("Viewing Original Package Sizes"), we will integrate three new fields into the GGP-OS compliance database and user interface. These fields track the initial package quantity and unit details at the time of creation.

## Proposed Changes

### 1. Database Schema
We will update the database definition and run migrations to add fields tracking original package sizes to the `packages` table:
* `original_quantity` (REAL)
* `original_unit_of_measure_name` (TEXT)
* `original_unit_of_measure_abbreviation` (TEXT)

#### [MODIFY] [tursoMigrations.ts](file:///c:/GGMA/GGMA/src/lib/tursoMigrations.ts)
* Update `CREATE TABLE IF NOT EXISTS packages` to include these three new columns.
* Append migration statements to `ALTER TABLE packages ADD COLUMN ...` inside `initializeDatabase()` with `try-catch` blocks to seamlessly migrate existing schemas.
* Update initial seed records to specify default original sizes for demo packages.

### 2. Metrc Engine Logic
We will ensure that when new packages are created, their initial quantities and units of measure are recorded as the original sizes.

#### [MODIFY] [MetrcEngine.ts](file:///c:/GGMA/GGMA/src/lib/metrc/MetrcEngine.ts)
* In `createPackage()`, save `original_quantity` (matching the creation split weight), `original_unit_of_measure_name` ("Grams"), and `original_unit_of_measure_abbreviation` ("g") in the insert query.

### 3. Compliance Console UI
We will display the original size in the Inventory Packages tab next to the current package weight to provide complete compliance traceability.

#### [MODIFY] [ComplianceWorkflowConsole.tsx](file:///c:/GGMA/GGMA/src/components/business/ComplianceWorkflowConsole.tsx)
* In the packages grid table body, update the weight column to render both the current weight and the original package size:
  `{pkg.weight} Grams (Original: {pkg.original_quantity || pkg.weight} {pkg.original_unit_of_measure_abbreviation || 'g'})`

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm the typescript builds successfully.

### Manual Verification
- Open the SINC Inventory (Compliance & Regulatory -> Inventory Packages) tab in the UI.
- Verify that packages display both their current weight and their original package size.

