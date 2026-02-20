import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../features/store";

interface PrivateRouteProps {
  permissionLevel?: string;
}

const PrivateRoute = ({ permissionLevel }: PrivateRouteProps) => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
