import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNameMap: Record<string, string> = {
    devices: 'Device Management',
    'drive-eraser': 'Secure Drive Eraser',
    'file-eraser': 'File & Folder Eraser',
    recovery: 'Forensic Recovery',
    results: 'Recovery Results',
    cases: 'Cases & Evidence',
    reports: 'Reports & Certificates',
    'audit-logs': 'Audit Logs',
    settings: 'Settings'
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-medium text-slate-200" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link to={to} className="hover:text-slate-200 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
