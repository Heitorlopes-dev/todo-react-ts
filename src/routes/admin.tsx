import { createFileRoute, redirect } from '@tanstack/react-router';
import { AdminPage } from '../pages/AdminPage';
import { EmailVerificationGate } from '../components/EmailVerificationGate';

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.loading) {
      if (!context.auth.user) {
        throw redirect({ to: '/login' });
      }
      if (context.auth.userData?.role !== 'admin') {
        throw redirect({ to: '/' }); // Redirect non-admins to home
      }
    }
  },
  component: function AdminRoute() {
    const { auth } = Route.useRouteContext();
    if (auth.loading) return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    return (
      <EmailVerificationGate>
        <AdminPage />
      </EmailVerificationGate>
    );
  },
});
