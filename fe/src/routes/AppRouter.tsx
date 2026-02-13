import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

const AppLayout = React.lazy(() => import("../layout/AppLayout"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = React.lazy(
  () => import("../pages/RegisterPage/RegisterPage"),
);

const AppRouter = () => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
