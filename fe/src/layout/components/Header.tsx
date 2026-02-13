import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import Logo from "../../assets/Fredericmalle_logo.png";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router";

const HeaderContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "black",
  padding: "0 0 1.625rem 0",
});

const SearchContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "3rem 3.125rem 1.625rem",
});

const LogoImage = styled("img")({
  height: "30px",
});

const RightIcons = styled(Box)({
  position: "absolute",
  right: "40px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
});

const MenuContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Nav = styled("ul")({
  display: "flex",
  gap: "40px",
  listStyle: "none",
  margin: 0,
  padding: 0,
});

const NavItem = styled("li")({
  color: "white",
  fontSize: "0.6875rem",
  letterSpacing: "1.5px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": { color: "#eb3300" },
});

const Header = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <SearchContainer>
        <LogoImage src={Logo} alt="logo-image" />
        <RightIcons>
          <IconButton>
            <Search strokeWidth={1} color="white" />
          </IconButton>
          <IconButton onClick={() => navigate("/login")}>
            <User strokeWidth={1} color="white" />
          </IconButton>
        </RightIcons>
      </SearchContainer>
      <MenuContainer>
        <Nav>
          <NavItem>THE ICONICS</NavItem>
          <NavItem>PERFUMES</NavItem>
          <NavItem>BODY</NavItem>
          <NavItem>HOME</NavItem>
          <NavItem>GIFTS</NavItem>
          <NavItem>ONLINE SERVICES</NavItem>
          <NavItem>DISCOVER FREDERIC MALLE</NavItem>
        </Nav>
      </MenuContainer>
    </HeaderContainer>
  );
};

export default Header;
