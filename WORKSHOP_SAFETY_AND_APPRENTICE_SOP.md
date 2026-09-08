# Workshop Safety, Triage & Apprentice SOP
## ONE E-Waste Emporia & Restorative Justice Lab

Sponsored by Our New Era (ONE) Church, this Standard Operating Procedure (SOP) governs all hands-on technical operations, safety standards, and apprentice learning milestones for returning citizens and individuals with disabilities.

---

## 1. Safety & Hazardous Materials Protocols

### A. Lithium-Ion Battery Handling (Critical)
- **Visual Triage on Intake:** Every battery must be visually inspected for swelling ("pillow effect"), punctures, liquid leakage, or corrosion before any power is applied.
- **Quarantine Containment:** Any damaged, swollen, or compromised battery must be immediately disconnected and placed inside a certified **Li-Po Fire-Retardant Safety Bag** filled with vermiculite.
- **Fire Suppression:** 
  - Standard water extinguishers must NEVER be used on lithium fires.
  - The church annex must maintain an inspected **Class D Metal / Lith-Ex Extinguisher** and a 5-gallon dry sand safety bucket within arm's reach of the intake bench.

### B. Electrostatic Discharge (ESD) Prevention
- Every apprentice and technician must wear a calibrated anti-static wrist strap clipped to the grounded common ground point.
- Diagnostic benches must maintain dissipative ESD mats tested to 10^6 – 10^9 ohms resistance.

---

## 2. Standard Diagnostic & Triage Workflow (The $50 Flat-Rate Process)

```
[Inbound Parcel Received] ──► [Barcode Scanned in Workbench] ──► [Visual Safety Check]
                                                                        │
        ┌───────────────────────────────────────────────────────────────┘
        ▼
[Hardware Bench Inspection]
 1. DC Jack & Power Rail Multimeter Resistance Test
 2. POST (Power-On Self-Test) Verification
 3. RAM Diagnostic (MemTest86 - Minimum 1 Full Pass)
 4. Storage Diagnostic (CrystalDiskInfo / smartctl SMART Health)
 5. Display & Thermal Paste Examination
        │
        ▼
[Draft Written Estimate in Workbench]
 1. Itemize Required Replacement Parts (with cost)
 2. Calculate Labor Hours
 3. Apply Mandatory -$50 Diagnostic Credit
        │
        ▼
[Supervisor Review & Transmit to Client]
```

---

## 3. The 30-Day Data Sanctuary Holding & Purge Procedure

1. **Air-Gapped Forensic Imaging:** Defective drives are imaged solely through hardware write-blockers (Tableau T8u or software write-blockers).
2. **Delivery & Checksum:** Files are delivered via Method A (Cloud Vault) or Method B (AES-256 Encrypted USB).
3. **Holding Timer:** The staging image is placed on the local laboratory offline NAS under `/staging/{work_order_id}/`.
4. **Day 31 Cryptographic Purge:** The supervisor issues the purge command:
   ```bash
   shred -v -n 3 -z /staging/{work_order_id}/forensic_image.dd
   ```
   A Certificate of Data Destruction is printed and logged with its SHA-256 verification hash into the `custody_audit_logs` table.

---

## 4. Apprentice Vocational Milestones (CompTIA A+ Alignment)

| Phase | Duration | Core Competencies | Real-World Deliverables |
| :--- | :--- | :--- | :--- |
| **Level 1: Intake & De-manufacturing** | Weeks 1–4 | E-waste sorting, component ID, lithium battery safety, ESD protocols, precious metal harvesting. | Disassemble 50 non-viable PCs down to clean scrap streams for R2v3 downstream. |
| **Level 2: Diagnostics & Upcycling** | Weeks 5–8 | Motherboard power rail testing, RAM/SSD installations, thermal paste renewal, BIOS/UEFI configuration. | Restore and test 25 laptops with lightweight open-source Linux for school donation. |
| **Level 3: Data Sanctuary & Sanitization** | Weeks 9–12 | Write-blocker operation, filesystem repair, NIST SP 800-88 cryptographic drive erasure, customer estimates. | Process 15 data recovery and sanitization work orders with verified checksums. |
| **Level 4: Capstone & Career Placement** | Weeks 13–16 | CompTIA A+ Core 1 & Core 2 exam preparation, resume authoring, industry fair-chance partner interviews. | Earn CompTIA A+ certification and graduate into living-wage IT technician employment. |

---

&copy; 2026 Our New Era (ONE) Church. Universal Agape in Vocational Restoration.
