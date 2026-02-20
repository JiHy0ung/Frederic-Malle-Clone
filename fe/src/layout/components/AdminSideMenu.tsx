import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";
import Logo from "../../assets/Fredericmalle_logo.png";

const AdminContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignContent: "center",
  gap: "5rem",
  backgroundColor: "black",
  height: "100vh",
  width: "15rem",
  padding: "2rem",
});

const LogoImage = styled("img")({
  height: "30px",
  cursor: "pointer",
});

const Nav = styled("ul")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignContent: "center",
  gap: "2rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
});

const NavItem = styled("li")({
  color: "white",
  fontSize: "0.875rem",
  letterSpacing: "1.5px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": { color: "#eb3300" },
});

const AdminSideMenu = () => {
  const navigate = useNavigate();
  return (
    <AdminContainer>
      <LogoImage src={Logo} alt="logo-image" onClick={() => navigate("/")} />
      <Nav>
        <NavItem onClick={() => navigate("/admin/product")}>Product</NavItem>
        <NavItem onClick={() => navigate("/admin/order")}>Order</NavItem>
      </Nav>
    </AdminContainer>
  );
};

export default AdminSideMenu;
