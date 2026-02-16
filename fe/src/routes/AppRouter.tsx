import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import PublicRoute from "./PublicRoute";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../features/store";
import { loginWithToken } from "../features/user/userSlice";
import LandingPage from "../pages/LandingPage/LandingPage";

const AppLayout = React.lazy(() => import("../layout/AppLayout"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = React.lazy(
  () => import("../pages/RegisterPage/RegisterPage"),
);

const AppRouter = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

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
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
