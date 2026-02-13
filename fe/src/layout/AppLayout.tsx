import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./components/Header";

const AppLayout = () => {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
};

export default AppLayout;
