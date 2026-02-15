import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../features/store";

const PublicRoute = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
