import { createFileRoute, redirect } from '@tanstack/react-router';
import { ArchivePage } from '../pages/ArchivePage';

export const Route = createFileRoute('/archive')({
  beforeLoad: ({ context }) => {
    if (!context.auth.loading && !context.auth.user) {
      throw redirect({ to: '/login' });
    }
  },
  component: function ArchiveRoute() {
    const { auth } = Route.useRouteContext();
    if (auth.loading) return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    return <ArchivePage />;
  },
});
