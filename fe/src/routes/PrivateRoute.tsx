import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../features/store";

interface PrivateRouteProps {
  permissionLevel?: string;
}

const PrivateRoute = ({ permissionLevel }: PrivateRouteProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
