import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../features/user/userSlice";
import type { RootState, AppDispatch } from "../../features/store";

import Logo from "../../assets/Fredericmalle_logo.png";
import { Search, User } from "lucide-react";
import SearchBox from "../../common/components/SearchBox";

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
  cursor: "pointer",
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

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    backgroundColor: "#1a1a1a",
    color: "white",
    minWidth: "180px",
    marginTop: "8px",
    borderRadius: 0,
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.875rem",
  padding: "12px 20px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#2a2a2a",
    color: "#eb3300",
  },
});

const SlideWrapper = styled("div")<{ open: boolean }>(({ open }) => ({
  width: open ? "" : "0px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  opacity: open ? 1 : 0,
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const [showSearch, setShowSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState<{
    page?: number;
    name?: string;
  }>({
    page: 1,
    name: "",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (searchQuery.name) {
      navigate(`/search?name=${searchQuery.name}`);
    }
  }, [searchQuery, navigate]);

  const handleUserIconClick = (event: React.MouseEvent<HTMLElement>) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate("/login");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyPage = () => {
    handleClose();
    navigate("/mypage");
  };

  const handleAdmin = () => {
    handleClose();
    navigate("/admin/product");
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate("/");
  };

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <HeaderContainer>
      <SearchContainer>
        <LogoImage src={Logo} alt="logo-image" onClick={() => navigate("/")} />
        <RightIcons>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SlideWrapper open={showSearch}>
              <SearchBox
                setSearchQuery={setSearchQuery}
                placeholder="Search..."
                field="name"
              />
            </SlideWrapper>

            <IconButton onClick={handleSearchClick}>
              <Search strokeWidth={1} color="white" />
            </IconButton>
          </Box>

          <IconButton onClick={handleUserIconClick}>
            <User strokeWidth={1} color="white" />
          </IconButton>
        </RightIcons>
      </SearchContainer>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user && (
          <Box sx={{ padding: "12px 20px", borderBottom: "1px solid #333" }}>
            <Box
              sx={{
                fontSize: "0.75rem",
                color: "#999",
                marginBottom: "0.25rem",
              }}
            >
              안녕하세요,
            </Box>
            <Box sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {user.name}님
            </Box>
          </Box>
        )}
        {user?.level === "admin" ? (
          <StyledMenuItem onClick={handleAdmin}>Admin Page</StyledMenuItem>
        ) : (
          <StyledMenuItem onClick={handleMyPage}>마이페이지</StyledMenuItem>
        )}
        <StyledMenuItem onClick={handleLogout}>로그아웃</StyledMenuItem>
      </StyledMenu>

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
