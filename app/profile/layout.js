import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Guards this private route on the client (see ProtectedRoute for why).
export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
