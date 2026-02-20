import { Outlet } from "react-router";
import AdminSideMenu from "./components/AdminSideMenu";
import { Box } from "@mui/material";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AdminSideMenu />
      <Outlet />
    </Box>
  );
};

export default AdminLayout;
