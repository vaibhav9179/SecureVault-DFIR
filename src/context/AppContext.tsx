import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Device,
  Case,
  RecoveredFile,
  ErasableFile,
  Report,
  AuditLog,
  ToastMessage,
  UserProfile,
  SanitizationMethod,
  SanitizationCertificate
} from '../types';
import {
  initialDevices,
  initialCases,
  initialRecoveredFiles,
  sampleErasableFiles,
  initialReports,
  initialAuditLogs,
  currentUser as defaultUser
} from '../data/mockData';

interface AppContextType {
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
  user: UserProfile;

  // Devices
  devices: Device[];
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  updateDeviceStatus: (id: string, status: Device['status'], hashStatus?: string) => void;
  addDevice: (device: Omit<Device, 'id'>) => void;

  // Cases
  cases: Case[];
  selectedCase: Case | null;
  setSelectedCase: (c: Case | null) => void;
  addCase: (newCase: { title: string; priority: Case['priority']; targetSubject: string; description: string; leadInvestigator?: string }) => void;

  // Recovered Files
  recoveredFiles: RecoveredFile[];
  selectedFile: RecoveredFile | null;
  setSelectedFile: (file: RecoveredFile | null) => void;
  classifyFile: (id: string, classification: RecoveredFile['classification']) => void;

  // Erasable Files
  erasableFiles: ErasableFile[];
  deleteFiles: (ids: string[], method: string) => void;

  // Reports
  reports: Report[];
  selectedReport: Report | null;
  setSelectedReport: (report: Report | null) => void;
  generateReport: (data: { title: string; type: Report['type']; caseId: string; deviceDetails: string; summary: string }) => Report;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, device: string, caseId: string, details?: string, status?: AuditLog['status']) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Active Sanitization Simulation State
  activeSanitization: {
    inProgress: boolean;
    deviceId: string | null;
    phase: 'idle' | 'initializing' | 'sanitizing' | 'verifying' | 'completed';
    progress: number;
    method: SanitizationMethod;
    verified: boolean;
    certificate: SanitizationCertificate | null;
  };
  startSanitization: (deviceId: string, method: SanitizationMethod, verify: boolean) => void;
  resetSanitization: () => void;

  // Active Forensic Scan State
  activeScan: {
    inProgress: boolean;
    deviceId: string | null;
    scanType: string;
    progress: number;
    sectorsScanned: number;
    totalSectors: number;
    filesDiscovered: number;
    deletedFiles: number;
    fragmentedFiles: number;
    corruptedFiles: number;
    currentLog: string;
    completed: boolean;
  };
  startForensicScan: (deviceId: string, scanType: string) => void;
  resetForensicScan: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user] = useState<UserProfile>(defaultUser);

  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [cases, setCases] = useState<Case[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const [recoveredFiles, setRecoveredFiles] = useState<RecoveredFile[]>(initialRecoveredFiles);
  const [selectedFile, setSelectedFile] = useState<RecoveredFile | null>(null);

  const [erasableFiles, setErasableFiles] = useState<ErasableFile[]>(sampleErasableFiles);

  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sanitization state
  const [activeSanitization, setActiveSanitization] = useState<{
    inProgress: boolean;
    deviceId: string | null;
    phase: 'idle' | 'initializing' | 'sanitizing' | 'verifying' | 'completed';
    progress: number;
    method: SanitizationMethod;
    verified: boolean;
    certificate: SanitizationCertificate | null;
  }>({
    inProgress: false,
    deviceId: null,
    phase: 'idle',
    progress: 0,
    method: 'Purge',
    verified: true,
    certificate: null
  });

  // Forensic Scan state
  const [activeScan, setActiveScan] = useState<{
    inProgress: boolean;
    deviceId: string | null;
    scanType: string;
    progress: number;
    sectorsScanned: number;
    totalSectors: number;
    filesDiscovered: number;
    deletedFiles: number;
    fragmentedFiles: number;
    corruptedFiles: number;
    currentLog: string;
    completed: boolean;
  }>({
    inProgress: false,
    deviceId: null,
    scanType: 'Deep Scan',
    progress: 0,
    sectorsScanned: 0,
    totalSectors: 3907029168,
    filesDiscovered: 0,
    deletedFiles: 0,
    fragmentedFiles: 0,
    corruptedFiles: 0,
    currentLog: '',
    completed: false
  });

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (email?: string) => {
    setIsAuthenticated(true);
    addToast('Authentication Verified', `Logged in as ${email || user.email} with Top Secret credentials.`, 'success');
    addAuditLog('User Login', 'Workstation Console Alpha-1', 'SYSTEM', 'Simulated cryptographic session established.');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('Logged Out', 'User session terminated successfully.', 'info');
  };

  const addAuditLog = (
    action: string,
    device: string,
    caseId: string,
    details?: string,
    status: AuditLog['status'] = 'Success'
  ) => {
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestampStr,
      user: user.name,
      action,
      device: device || 'Host Workstation',
      caseId: caseId || 'CASE-2026-001',
      status,
      hash: `${randomHex}884c7d65...`,
      ipSession: '192.168.10.45 / SES-9821',
      details: details || `${action} executed successfully under forensic isolation.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateDeviceStatus = (id: string, status: Device['status'], hashStatus?: string) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              status,
              ...(hashStatus ? { hashStatus } : {})
            }
          : d
      )
    );
  };

  const addDevice = (deviceData: Omit<Device, 'id'>) => {
    const newId = `DEV-00${devices.length + 1}`;
    const newDevice: Device = {
      ...deviceData,
      id: newId
    };
    setDevices(prev => [...prev, newDevice]);
    addToast('Device Attached', `${newDevice.name} registered in read-only write-blocker mode.`, 'success');
    addAuditLog('Device Added', newDevice.name, newDevice.associatedCaseId || 'UNASSIGNED', `Serial: ${newDevice.serialNumber}`);
  };

  const addCase = ({
    title,
    priority,
    targetSubject,
    description,
    leadInvestigator
  }: {
    title: string;
    priority: Case['priority'];
    targetSubject: string;
    description: string;
    leadInvestigator?: string;
  }) => {
    const nextNumber = String(cases.length + 1).padStart(3, '0');
    const caseId = `CASE-2026-${nextNumber}`;
    const now = new Date().toISOString().split('T')[0];

    const newCase: Case = {
      id: caseId,
      title,
      investigator: leadInvestigator || user.name,
      investigatorEmail: user.email,
      evidenceCount: 0,
      status: 'Active',
      priority,
      createdDate: now,
      targetSubject,
      description,
      evidenceList: [],
      chainOfCustody: [
        {
          id: `COC-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: `${now} 09:00 UTC`,
          custodian: leadInvestigator || user.name,
          action: 'Initial Case Creation and Evidence Ledger Initialization',
          location: 'DFIR Command Center',
          digitalSignature: `SIG-${caseId}-INIT`
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    addToast('Case Created', `${caseId} created and assigned to ${newCase.investigator}.`, 'success');
    addAuditLog('Case Created', 'Ledger Registry', caseId, `Subject: ${targetSubject}`);
  };

  const classifyFile = (id: string, classification: RecoveredFile['classification']) => {
    setRecoveredFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, classification } : f))
    );
    addToast('Evidence Classified', `File marked as ${classification}.`, 'success');
  };

  const deleteFiles = (ids: string[], method: string) => {
    const count = ids.length;
    setErasableFiles(prev => prev.filter(f => !ids.includes(f.id)));
    addToast('Secure File Erasure Completed', `${count} file(s) scrubbed using ${method}. Sectors verified null.`, 'success');
    addAuditLog('Files Sanitized', 'Internal Volume', 'CASE-2026-001', `${count} files purged via ${method} (100% entropy nullified).`);
  };

  const generateReport = (data: {
    title: string;
    type: Report['type'];
    caseId: string;
    deviceDetails: string;
    summary: string;
  }): Report => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    const reportId = `REP-2026-${String(reports.length + 1).padStart(3, '0')}`;
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newReport: Report = {
      id: reportId,
      title: data.title,
      type: data.type,
      caseId: data.caseId,
      generatedDate: dateStr,
      status: 'Signed & Sealed',
      author: user.name,
      deviceDetails: data.deviceDetails,
      actionsPerformed: [
        'Automated integrity hash verification against master clone image',
        'Detailed artifact taxonomy and temporal timeline alignment',
        'Compliance audit against NIST SP 800-88 / ISO 27037 forensic guidelines',
        'Digital signature generation with laboratory root CA'
      ],
      sha256: randomHash,
      verificationResult: 'VERIFIED — All records mathematically validated with zero tampering.',
      summary: data.summary
    };

    setReports(prev => [newReport, ...prev]);
    addToast('Report Generated', `${reportId} successfully compiled and digitally signed.`, 'success');
    addAuditLog('Report Generated', data.deviceDetails, data.caseId, `Report ${reportId} published.`);
    return newReport;
  };

  // Sanitization Simulation Runner
  const startSanitization = (deviceId: string, method: SanitizationMethod, verify: boolean) => {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) return;

    setActiveSanitization({
      inProgress: true,
      deviceId,
      phase: 'initializing',
      progress: 0,
      method,
      verified: verify,
      certificate: null
    });

    addToast('Sanitization Initializing', `Locking ${dev.name} for simulated ${method}...`, 'info');
    addAuditLog('Sanitization Started', dev.name, dev.associatedCaseId || 'UNASSIGNED', `Standard: ${method}`);

    // Progress Simulation Sequence
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;

      if (currentStep <= 2) {
        setActiveSanitization(prev => ({ ...prev, phase: 'initializing', progress: currentStep * 10 }));
      } else if (currentStep <= 8) {
        const wipeProgress = Math.min(80, 20 + (currentStep - 2) * 10);
        setActiveSanitization(prev => ({ ...prev, phase: 'sanitizing', progress: wipeProgress }));
      } else if (currentStep <= 10) {
        setActiveSanitization(prev => ({ ...prev, phase: 'verifying', progress: 80 + (currentStep - 8) * 10 }));
      } else {
        clearInterval(interval);
        // Build Certificate
        const certId = `CERT-${Math.floor(1000 + Math.random() * 9000)}-${dev.type}`;
        const completionTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        const cert: SanitizationCertificate = {
          certificateId: certId,
          deviceId: dev.id,
          deviceName: dev.name,
          serialNumber: dev.serialNumber,
          capacity: dev.capacity,
          methodApplied: method,
          standard: method === 'Clear' ? 'NIST SP 800-88 Rev 1 (Clear)' : method === 'Purge' ? 'DoD 5220.22-M 3-Pass (Purge)' : 'IEEE 1667 Cryptographic Erase',
          startTime: new Date(Date.now() - 36000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          completionTime,
          duration: '3m 12s (Simulated)',
          technician: `${user.name} (${user.badgeId})`,
          verificationMethod: verify ? '100% Full Sector Read Verification' : 'Random Sample Verification (10%)',
          verificationResult: '100% PASSED — Zero recoverable patterns detected (Entropy 0.00)',
          zeroPatternChecked: true,
          finalSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          digitalSignature: `SIG-ECDSA-SECUREVAULT-${certId}`
        };

        setActiveSanitization(prev => ({
          ...prev,
          phase: 'completed',
          progress: 100,
          inProgress: false,
          certificate: cert
        }));

        updateDeviceStatus(dev.id, 'Sanitized', 'Zeroed (0x00 pattern verified)');
        addToast('Sanitization Complete', `${dev.name} successfully sterilized. Certificate ${certId} issued.`, 'success');
        addAuditLog('Sanitization Verified', dev.name, dev.associatedCaseId || 'UNASSIGNED', `Certificate ${certId} issued.`);

        // Also push a Certificate report to reports list
        const certReport: Report = {
          id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `Sanitization Certificate — ${dev.name}`,
          type: 'Secure Erasure Certificate',
          caseId: dev.associatedCaseId || 'CASE-2026-001',
          generatedDate: completionTime,
          status: 'Signed & Sealed',
          author: user.name,
          deviceDetails: `${dev.name} (${dev.capacity}, S/N: ${dev.serialNumber})`,
          actionsPerformed: [
            `Overwritten via ${method} sanitization algorithms`,
            'Logical Block Addressing (LBA) boundary verification',
            'Full surface read-back entropy verification (0.000000)',
            'Master Boot Record / GPT partition table scrub'
          ],
          sha256: cert.finalSha256,
          verificationResult: 'PASSED — 100% sterile sectors confirmed.',
          summary: `Media sanitized under NIST SP 800-88 Rev 1 specifications. Device safe for disposal or redeployment.`,
          certificateData: cert
        };
        setReports(prev => [certReport, ...prev]);
      }
    }, 700);
  };

  const resetSanitization = () => {
    setActiveSanitization({
      inProgress: false,
      deviceId: null,
      phase: 'idle',
      progress: 0,
      method: 'Purge',
      verified: true,
      certificate: null
    });
  };

  // Forensic Scan Simulation Runner
  const startForensicScan = (deviceId: string, scanType: string) => {
    const dev = devices.find(d => d.id === deviceId);
    const targetDevName = dev ? dev.name : 'Target Storage Device';

    setActiveScan({
      inProgress: true,
      deviceId,
      scanType,
      progress: 0,
      sectorsScanned: 0,
      totalSectors: dev ? dev.totalSectors : 3907029168,
      filesDiscovered: 0,
      deletedFiles: 0,
      fragmentedFiles: 0,
      corruptedFiles: 0,
      currentLog: 'Mounting image with hardware write-blocker isolation...',
      completed: false
    });

    if (dev) {
      updateDeviceStatus(dev.id, 'Scanning', 'In Progress...');
    }

    addToast('Forensic Scan Started', `Executing ${scanType} on ${targetDevName}...`, 'info');
    addAuditLog('Recovery Scan Started', targetDevName, dev?.associatedCaseId || 'CASE-2026-001', `Scan Type: ${scanType}`);

    const logs = [
      'Scanning Master File Table ($MFT) records...',
      'Cluster allocation bitmap parsed: 142 unallocated fragments identified.',
      'Magic byte match: Carving JPEG stream at offset 0x004F1820...',
      'Magic byte match: PKZIP archive identified at cluster 49201...',
      'Deep Carving: Reconstructing fragmented MPEG-4 stream headers...',
      'Identified deleted SQLite History database from cluster 0x88F02...',
      'Verifying carved artifacts against known hash set (NSRL RDS)...',
      'Scan finishing: compiling 1,248 recovered forensic artifacts.'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progressPercent = Math.min(100, step * 12.5);
      const sectorsScanned = Math.floor((progressPercent / 100) * (dev ? dev.totalSectors : 3907029168));
      const discovered = Math.floor(step * 156);
      const deleted = Math.floor(step * 84);
      const fragmented = Math.floor(step * 18);
      const corrupted = Math.floor(step * 4);
      const currentLog = logs[Math.min(step - 1, logs.length - 1)];

      if (progressPercent >= 100) {
        clearInterval(interval);
        setActiveScan({
          inProgress: false,
          deviceId,
          scanType,
          progress: 100,
          sectorsScanned: dev ? dev.totalSectors : 3907029168,
          totalSectors: dev ? dev.totalSectors : 3907029168,
          filesDiscovered: 1248,
          deletedFiles: 672,
          fragmentedFiles: 144,
          corruptedFiles: 32,
          currentLog: 'Forensic scan complete. 1,248 recoverable artifacts indexed.',
          completed: true
        });

        if (dev) {
          updateDeviceStatus(dev.id, 'Ready', 'Verified SHA-256');
        }

        addToast('Forensic Scan Completed', `Successfully discovered 1,248 artifacts across ${dev?.capacity || 'target drive'}.`, 'success');
        addAuditLog('Recovery Completed', targetDevName, dev?.associatedCaseId || 'CASE-2026-001', '1,248 files recovered and classified.');
      } else {
        setActiveScan(prev => ({
          ...prev,
          progress: progressPercent,
          sectorsScanned,
          filesDiscovered: discovered,
          deletedFiles: deleted,
          fragmentedFiles: fragmented,
          corruptedFiles: corrupted,
          currentLog
        }));
      }
    }, 650);
  };

  const resetForensicScan = () => {
    setActiveScan({
      inProgress: false,
      deviceId: null,
      scanType: 'Deep Scan',
      progress: 0,
      sectorsScanned: 0,
      totalSectors: 3907029168,
      filesDiscovered: 0,
      deletedFiles: 0,
      fragmentedFiles: 0,
      corruptedFiles: 0,
      currentLog: '',
      completed: false
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        devices,
        selectedDevice,
        setSelectedDevice,
        updateDeviceStatus,
        addDevice,
        cases,
        selectedCase,
        setSelectedCase,
        addCase,
        recoveredFiles,
        selectedFile,
        setSelectedFile,
        classifyFile,
        erasableFiles,
        deleteFiles,
        reports,
        selectedReport,
        setSelectedReport,
        generateReport,
        auditLogs,
        addAuditLog,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        activeSanitization,
        startSanitization,
        resetSanitization,
        activeScan,
        startForensicScan,
        resetForensicScan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
