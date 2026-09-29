export type DeviceType = 'HDD' | 'SSD' | 'USB' | 'NVMe' | 'SD Card' | 'Forensic Image';
export type DeviceStatus = 'Ready' | 'Acquired' | 'Sanitized' | 'Scanning' | 'In Review' | 'Write-Blocked';
export type CaseStatus = 'Active' | 'In Review' | 'Closed' | 'Archived';
export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Critical';
export type SanitizationMethod = 'Clear' | 'Purge' | 'Cryptographic Erase' | 'Gutmann 35-Pass';
export type FileCategory = 'Documents' | 'Images' | 'Videos' | 'Archives' | 'Databases';
export type FileIntegrityStatus = 'Intact' | 'Fragmented' | 'Carved' | 'Corrupted';

export interface Device {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  type: DeviceType;
  capacity: string;
  capacityBytes: number;
  fileSystem: string;
  status: DeviceStatus;
  lastScanned: string;
  hashStatus: string;
  sha256: string;
  md5: string;
  mountPoint: string;
  writeBlockerActive: boolean;
  smartHealth: string;
  temperature: string;
  sectorSize: string;
  totalSectors: number;
  associatedCaseId?: string;
}

export interface CaseEvidence {
  evidenceId: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  acquisitionDate: string;
  sha256: string;
  custodian: string;
  status: 'Acquired' | 'In Analysis' | 'Verified' | 'Archived';
  notes: string;
}

export interface CustodyRecord {
  id: string;
  timestamp: string;
  custodian: string;
  action: string;
  location: string;
  digitalSignature: string;
}

export interface Case {
  id: string;
  title: string;
  investigator: string;
  investigatorEmail: string;
  evidenceCount: number;
  status: CaseStatus;
  priority: PriorityLevel;
  createdDate: string;
  targetSubject: string;
  description: string;
  evidenceList: CaseEvidence[];
  chainOfCustody: CustodyRecord[];
}

export interface RecoveredFile {
  id: string;
  name: string;
  category: FileCategory;
  extension: string;
  size: string;
  sizeBytes: number;
  originalLocation: string;
  status: FileIntegrityStatus;
  confidence: number;
  sha256: string;
  md5: string;
  recoveryMethod: 'MFT Entry' | 'Magic Bytes Carving' | 'Cluster Recovery' | 'Heuristic Assembly';
  evidenceId: string;
  caseId: string;
  recoveryTimestamp: string;
  classification: 'Evidence Tier 1' | 'High Relevance' | 'Unclassified' | 'Inconclusive';
  hexSnippet: string;
  previewUrl?: string;
}

export interface ErasableFile {
  id: string;
  name: string;
  extension: string;
  size: string;
  sizeBytes: number;
  path: string;
  dateModified: string;
  entropy: string;
}

export interface SanitizationCertificate {
  certificateId: string;
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  capacity: string;
  methodApplied: SanitizationMethod;
  standard: string;
  startTime: string;
  completionTime: string;
  duration: string;
  technician: string;
  verificationMethod: string;
  verificationResult: string;
  zeroPatternChecked: boolean;
  finalSha256: string;
  digitalSignature: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'Forensic Recovery Report' | 'Secure Erasure Certificate' | 'Evidence Integrity Report' | 'Audit Report';
  caseId: string;
  generatedDate: string;
  status: 'Signed & Sealed' | 'Verified' | 'Draft';
  author: string;
  deviceDetails: string;
  actionsPerformed: string[];
  sha256: string;
  verificationResult: string;
  summary: string;
  downloadUrl?: string;
  certificateData?: SanitizationCertificate;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  device: string;
  caseId: string;
  status: 'Success' | 'Warning' | 'Flagged';
  hash: string;
  ipSession: string;
  details?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  badgeId: string;
  role: string;
  agency: string;
  email: string;
  clearanceLevel: string;
  avatarInitials: string;
}
