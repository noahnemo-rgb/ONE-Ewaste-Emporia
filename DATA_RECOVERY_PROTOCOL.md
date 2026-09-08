# Secure Data Return & Custody Protocol
## ONE E-Waste Emporia — The Data Sanctuary Ministry

Rooted in the unchanged *agape* teachings of Yeshua ben Yosef, we hold personal memories, family photographs, and historical records in sacred trust. This document outlines the technical, operational, and physical protocols for how recovered customer data is packaged, encrypted, and delivered back to the rightful owner.

---

## 1. Dual Delivery Pathways

During initial work order intake or upon estimate approval, the customer designates their preferred delivery method based on dataset size and connectivity needs:

### Method A: End-to-End Encrypted Cloud Vault (Fastest & Included)
- **Applicability:** Ideal for logical recoveries, family documents, and photo libraries under 100 GB.
- **Security Architecture:** Recovered files are placed into an isolated, time-limited Amazon S3 / Cloudflare R2 bucket with AES-256 server-side encryption (SSE-KMS) and strict pre-signed URLs.
- **Out-of-Band Key Exchange:** The download link is emailed to the client. The decryption passphrase / 2FA one-time PIN (OTP) is sent separately via SMS or verified telephone call. Decryption keys are **never** included in unencrypted emails alongside links.
- **Link Expiration:** Download links remain active for **14 calendar days**. Once the client confirms receipt or upon day 14, the cloud vault is cryptographically deleted.

### Method B: Hardware-Encrypted Physical Media (USB 3.2 / External SSD)
- **Applicability:** Recommended for large datasets (>100 GB), video archives, full operating system clone images, or clients with limited broadband.
- **Media Provisioning Options:**
  1. **New Encrypted 128GB Flash Drive (+ $25):** Factory-sealed Kingston or SanDisk USB 3.2 drive formatted with cross-platform AES-256 encryption.
  2. **New Encrypted 1TB External SSD (+ $85):** High-speed external solid state drive for large family media archives.
  3. **Customer-Supplied Spare Drive (Free):** The client simply includes their own clean external drive or USB stick in the original shipping box.
- **Zero-Key In-Box Rule:** The decryption key is **never printed or included inside the physical shipping parcel**. Decryption passphrases are transmitted solely through the client's verified phone/SMS channel once postal tracking confirms delivery.
- **Postal Security:** Shipped via USPS Priority Mail or UPS with tracking and direct signature required upon delivery.

---

## 2. Laboratory Chain of Custody & Sanitization

```
[Inbound Defective Drive]
        │
        ▼
[Hardware Write-Blocker Bench (Tableau / Linux ddrescue)]
        │
        ▼
[Forensic Bit-Stream Image (.dd / .raw)]
        │
        ▼
[Extracted Customer Data Vault (Air-Gapped Offline NAS)]
        │
        ├─────────────────────────────────────────┐
        ▼                                         ▼
[Method A: Encrypted Cloud Portal]       [Method B: Encrypted Physical USB]
 - Time-limited 14-day token              - AES-256 Encrypted Volume
 - Out-of-band SMS PIN                    - Signature-tracked courier
        │                                         │
        └───────────────────┬─────────────────────┘
                            │
                            ▼
              [30-Day Courtesy Safety Hold]
  (Guarantees data safety if parcel is lost or download fails)
                            │
                            ▼
              [NIST SP 800-88 Purge on Lab NAS]
              [Certificate of Destruction Issued]
```

---

## 3. The 30-Day Safety Holding Window

Postal shipments can be misdelivered, and computer downloads can be interrupted. To prevent catastrophic permanent loss:
1. **Offline Retention:** The recovered image is retained on the church's air-gapped laboratory staging server for exactly **thirty (30) calendar days** following dispatch.
2. **Cryptographic Purge:** On Day 31 (or immediately upon customer written confirmation of successful data verification), the staging image is permanently purged using NIST SP 800-88 Rev. 1 multi-pass wiping.
3. **No Secondary Archives:** ONE Church maintains zero long-term copies, cold storage, or cloud shadows of customer personal files.

---

## 4. Verification Checksums

Every delivery includes a plain-text cryptographic checksum manifest (`SHA-256-checksums.txt`). Clients can run a single command in Windows, macOS, or Linux to verify that every photo, video, and document arrived byte-for-byte intact with zero bit-rot or file corruption.
