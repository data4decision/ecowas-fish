import { Navigate, Outlet, useParams } from 'react-router-dom';

export default function ClientRouteProtector({ user }) {
  const { countryCode } = useParams();

  const userCountry = user?.countryCode?.toLowerCase();
  const routeCountry = countryCode?.toLowerCase();

  // Block access if user role or country does not match the route
  if (user?.role !== 'client' || userCountry !== routeCountry) {
    return <Navigate to={`/${userCountry || 'ng'}/login`} replace />;
  }

  return <Outlet />;
}
