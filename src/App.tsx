/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeviceManagementPage } from './pages/DeviceManagementPage';
import { DriveEraserPage } from './pages/DriveEraserPage';
import { FileEraserPage } from './pages/FileEraserPage';
import { ForensicRecoveryPage } from './pages/ForensicRecoveryPage';
import { RecoveryResultsPage } from './pages/RecoveryResultsPage';
import { CasesPage } from './pages/CasesPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Simulated Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/devices" element={<DeviceManagementPage />} />
            <Route path="/drive-eraser" element={<DriveEraserPage />} />
            <Route path="/file-eraser" element={<FileEraserPage />} />
            <Route path="/recovery" element={<ForensicRecoveryPage />} />
            <Route path="/results" element={<RecoveryResultsPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
