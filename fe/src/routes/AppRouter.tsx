import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import PublicRoute from "./PublicRoute";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../features/store";
import { loginWithToken } from "../features/user/userSlice";
import LandingPage from "../pages/LandingPage/LandingPage";
import PrivateRoute from "./PrivateRoute";
import AdminProductPage from "../pages/AdminProductPage/AdminProductPage";
import AdminLayout from "../layout/AdminLayout";

const AppLayout = React.lazy(() => import("../layout/AppLayout"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = React.lazy(
  () => import("../pages/RegisterPage/RegisterPage"),
);

const AppRouter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const timeout = new Promise((resolve) => setTimeout(resolve, 3000));

      Promise.race([dispatch(loginWithToken(token)), timeout]).finally(() => {
        setIsAuthChecked(true);
      });
    } else {
      setTimeout(() => setIsAuthChecked(true), 0);
    }
  }, [dispatch]);

  if (!isAuthChecked) return <div>...loading</div>;

  return (
    <Suspense fallback={<div>...loading</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<AdminLayout />}>
          <Route element={<PrivateRoute permissionLevel="admin" />}>
            <Route path="/admin/product" element={<AdminProductPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
