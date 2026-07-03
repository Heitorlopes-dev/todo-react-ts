import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '../pages/LoginPage';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // Só redireciona pra home se estiver logado E com email verificado
    if (!context.auth.loading && context.auth.user && context.auth.user.emailVerified) {
      throw redirect({ to: '/' });
    }
  },
  component: function LoginRoute() {
    const { auth } = Route.useRouteContext();
    if (auth.loading) return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    return <LoginPage />;
  },
});
