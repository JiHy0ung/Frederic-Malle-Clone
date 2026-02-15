import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../features/store";

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
