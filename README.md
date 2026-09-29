# SecureVault DFIR
> **Secure Data Sanitization & Digital Forensic Recovery Platform**  
> Smart India Hackathon (SIH) Cybersecurity & Digital Forensics Prototype

---

## 🛡️ Executive Summary

**SecureVault DFIR** is an interactive, frontend-only forensic dashboard and media sanitization demonstration platform built for SIH college hackathon demonstrations. It showcases enterprise-grade digital forensics incident response (DFIR) workflows adhering to **NIST SP 800-88 Rev 1**, **DoD 5220.22-M**, and **ISO/IEC 27037** standards.


---

## 🚀 Key Features

1. **Simulated Authentication Enclave (`/login`)**:
   - Agency credentials, badge identification, and instant 1-Click Demo Login.
2. **Forensic Command Dashboard (`/`)**:
   - Real-time metrics: 12 Total Devices, 8 Active Cases, 1,248 Recovered Files, 24 Sanitized Devices, 100% Verification Rate.
   - Interactive 5-stage pipeline visualization (*Acquire → Analyze → Erase/Recover → Verify → Report*).
3. **Storage Device Management (`/devices`)**:
   - Table and card view of connected HDDs, SSDs, NVMe drives, USB sticks, and SD cards.
   - S.M.A.R.T. health checks, logical block addresses (LBA), and write-blocker indicators.
4. **Secure Drive Sanitizer (`/drive-eraser`)**:
   - Multi-standard overwrite engine (NIST SP 800-88 Clear, DoD 5220.22-M Purge, Cryptographic Erase, Gutmann 35-Pass).
   - Real-time animated LBA sector visualizer and automated Sanitization Certificate generation.
5. **Secure File & Folder Shredder (`/file-eraser`)**:
   - Multi-select file scrubbing with MFT attribute zeroing, slack space clearing, and residual entropy verification.
6. **Digital Forensic Recovery Engine (`/recovery`)**:
   - Raw cluster carving, magic bytes recognition, and fragment re-assembly with animated sector tracker.
7. **Carved Artifact Classification (`/results`)**:
   - Recovered documents, images, video fragments, and databases with confidence scores (95%, 91%, 87%, 82%).
   - Deep inspection panel with raw magic bytes hex viewer and NSRL RDS hash verification.
8. **Cases & Evidence Management (`/cases`)**:
   - Incident response dockets with immutable chain-of-custody ledgers and digital signature stamps.
9. **Reports & Official Certificates (`/reports`)**:
   - Official ISO 27037 and NIST SP 800-88 forensic reports with print and PDF export simulation.
10. **Immutable Audit Trail (`/audit-logs`)**:
    - Chronological table and interactive forensic timeline with event hashes and session IPs.

---

## 💻 Tech Stack

- **React 19** (Functional components, custom hooks, context state management)
- **React Router 7** (Multi-page client-side routing)
- **Tailwind CSS v4** (Modern dark slate palette `#090d16` with cyan and indigo accents)
- **Lucide React** (Crisp vector iconography)
- **JetBrains Mono & Plus Jakarta Sans** (Technical typography and tabular figures)

---

## 📁 Project Folder Structure

```
├── index.html                   # HTML entry point with metadata & Google Fonts
├── metadata.json                # AI Studio application configuration
├── package.json                 # Dependencies & build scripts
├── README.md                    # Project documentation
├── src/
│   ├── App.tsx                  # React Router configuration & route guard
│   ├── main.tsx                 # React DOM root mounting
│   ├── index.css                # Tailwind CSS v4 styling & dark theme variables
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for Devices, Cases, Reports, etc.
│   ├── data/
│   │   └── mockData.ts          # Realistic DFIR sample datasets
│   ├── context/
│   │   └── AppContext.tsx       # Central state store, toast system, & simulation runners
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatCard.tsx     # Metric cards with tabular figures
│   │   │   ├── StatusBadge.tsx  # Tonal status indicators
│   │   │   ├── Modal.tsx        # Accessible backdrop modal
│   │   │   ├── Toast.tsx        # Floating notification system
│   │   │   ├── SimulationBanner.tsx # Safety notice banner
│   │   │   ├── EmptyState.tsx   # Empty state displays
│   │   │   └── LoadingSkeleton.tsx # Skeleton table placeholders
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Responsive sidebar navigation
│   │   │   ├── Navbar.tsx       # Top bar with global search, notifications, profile
│   │   │   ├── Breadcrumbs.tsx  # Contextual breadcrumb navigation
│   │   │   └── MainLayout.tsx   # Root layout wrapper
│   │   └── modals/
│   │       ├── CreateCaseModal.tsx   # New case dossier creator
│   │       ├── DeviceDetailModal.tsx # Hardware specs & S.M.A.R.T. inspector
│   │       ├── FilePreviewModal.tsx  # Artifact hex viewer & classifier
│   │       ├── ReportViewModal.tsx   # Official report letterhead & certificate
│   │       └── GlobalSearchModal.tsx # Cmd+K quick search across all resources
│   └── pages/
│       ├── LoginPage.tsx             # Simulated authentication
│       ├── DashboardPage.tsx         # Executive command dashboard
│       ├── DeviceManagementPage.tsx  # Storage media management
│       ├── DriveEraserPage.tsx       # NIST SP 800-88 sanitization engine
│       ├── FileEraserPage.tsx        # File shredder & MFT scrubber
│       ├── ForensicRecoveryPage.tsx  # Deep cluster carving scanner
│       ├── RecoveryResultsPage.tsx   # Carved file classification & preview
│       ├── CasesPage.tsx             # Case dockets & chain of custody
│       ├── ReportsPage.tsx           # Reports & certificates archive
│       ├── AuditLogsPage.tsx         # Immutable audit trail & timeline
│       └── SettingsPage.tsx          # Lab policies & examiner credentials
```

---

## 🛠️ How to Install and Run

### 1. Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)

### 2. Installation
```bash
# Clone or navigate to the project directory
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist` directory.

---

## 🏆 Smart India Hackathon Demonstration Guide

### Recommended Demo Flow:
1. **Login Screen**: Click **"Instant 1-Click Demo Login"** to enter with Lead Investigator credentials.
2. **Dashboard**: Highlight the 5 key metrics and the interactive **Acquire → Analyze → Erase/Recover → Verify → Report** pipeline.
3. **Devices**: View connected physical drives. Click **"WD My Passport"** to inspect S.M.A.R.T. health, serial numbers, and write-block status.
4. **Forensic Recovery**: Click **"Start Recovery"** on the WD Drive. Select **"Deep Scan (Raw Cluster Carving)"** and click **"Start Forensic Scan"** to watch the real-time sector scanner in action.
5. **Recovery Results**: Click **"Explore 1,248 Recovered Files"**. Filter by **Documents** or **Images**. Click `investigation_report_q3_confidential.pdf` to inspect its magic bytes header and confidence score.
6. **Secure Drive Eraser**: Switch to **Secure Drive Eraser**. Select `SanDisk Ultra USB`, choose **Purge (DoD 5220.22-M)**, click **"Start Sanitization Workflow"**, type `SANITIZE`, and observe the live sector LBA visualizer.
7. **Official Certificate**: Inspect the generated **NIST SP 800-88 Sanitization Certificate** with digital signature and 100% verified zero entropy.
8. **Audit Trail**: Visit **Audit Logs** and toggle the **Timeline View** to demonstrate the immutable chronological event ledger.

---

## 📜 License
Developed for educational, research, and hackathon presentation purposes. Open-source prototype under the Apache-2.0 License.
