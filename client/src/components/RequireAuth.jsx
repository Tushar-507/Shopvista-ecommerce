import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PageLoader } from './Skeletons.jsx';

/**
 * Guards routes that require an account (checkout, order history). While a
 * stored session is being verified we show a loader instead of redirecting, so
 * a refresh does not bounce a signed-in shopper to signup.
 *
 * `reason` is forwarded to the auth page so it can explain why an account is
 * needed and where to return afterwards.
 */
export default function RequireAuth({ children, reason = 'purchase' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <PageLoader label="Checking your account..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/signup"
        replace
        state={{ from: location, reason }}
      />
    );
  }

  return children;
}
