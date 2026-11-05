import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RoleGuard } from '@/features/auth/RoleGuard';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const TicketsListPage = lazy(() =>
  import('@/pages/TicketsListPage').then((m) => ({ default: m.TicketsListPage }))
);
const TicketDetailPage = lazy(() =>
  import('@/pages/TicketDetailPage').then((m) => ({ default: m.TicketDetailPage }))
);
const CreateTicketPage = lazy(() =>
  import('@/pages/CreateTicketPage').then((m) => ({ default: m.CreateTicketPage }))
);
const EditTicketPage = lazy(() =>
  import('@/pages/EditTicketPage').then((m) => ({ default: m.EditTicketPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const SystemDiagnostics = lazy(() =>
  import('@/features/diagnostics/SystemDiagnostics').then((m) => ({
    default: m.SystemDiagnostics,
  }))
);
const ForbiddenPage = lazy(() =>
  import('@/pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoader: React.FC = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
    <div className="flex flex-col items-center gap-3">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="font-mono text-xs text-on-surface-variant">LOADING VIEW...</span>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // Public Authentication Routes
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },

  // Protected Authenticated Workspace
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'tickets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TicketsListPage />
          </Suspense>
        ),
      },
      {
        path: 'tickets/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateTicketPage />
          </Suspense>
        ),
      },
      {
        path: 'tickets/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TicketDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'tickets/:id/edit',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <Suspense fallback={<PageLoader />}>
              <EditTicketPage />
            </Suspense>
          </RoleGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'diagnostics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SystemDiagnostics />
          </Suspense>
        ),
      },
    ],
  },

  // Error Pages
  {
    path: '/forbidden',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForbiddenPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
