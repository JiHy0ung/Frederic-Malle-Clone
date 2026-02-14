import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api";
import axios from "axios";

const LoginContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "3.125rem",
});

const LoginBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  width: "28.125rem",
  gap: "1rem",
});

const LoginTitle = styled(Typography)({
  display: "flex",
  justifySelf: "center",
  alignSelf: "center",
  alignItems: "center",
  fontSize: "1.5625rem",
});

const TextButton = styled(Button)({
  background: "none",
  border: "none",
  padding: 0,
  fontSize: "0.75rem",
  textDecoration: "underline",
  cursor: "pointer",
  color: "black",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#EE0000",
    textDecoration: "underline",
  },
});

const AuthInput = styled(TextField)({
  width: "25.864375rem",

  "& .MuiOutlinedInput-root": {
    height: "1.8875rem",
    borderRadius: 0,

    "& .MuiOutlinedInput-input": {
      padding: "0 8px",
      fontSize: "0.75rem",
      height: "100%",
      boxSizing: "border-box",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #b4b4b4",
    },
  },

  "& .MuiInputLabel-root": {
    fontSize: "12px",
    color: "#666",
    top: "50%",
    transform: "translate(14px, -50%) scale(1)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  "& .MuiInputLabel-shrink": {
    top: 0,
    transform: "translate(14px, -6px) scale(0.75)",
  },
});

const CheckboxWrapper = styled("label")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  fontSize: "0.875rem",
});

const HiddenCheckbox = styled("input")({
  display: "none",
});

const StyledBox = styled("span")<{ checked: boolean }>(({ checked }) => ({
  width: "17px",
  height: "17px",
  border: "1px solid black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  ...(checked && {
    "&::before": {
      content: '""',
      position: "absolute",
      width: "21px",
      height: "1px",
      background: "black",
      transform: "rotate(45deg)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      width: "21px",
      height: "1px",
      background: "black",
      transform: "rotate(-45deg)",
    },
  }),
}));

const ErrorText = styled(Typography)({
  height: "0.75rem",
  fontSize: "0.75rem",
  color: "#EE0000",
});

const LoginButton = styled(Button)({
  width: "16rem",
  height: "2.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#EE0000",
  color: "white",
  fontSize: "0.75rem",
  borderRadius: 0,
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/user/login", { email, password });

      if (res.status === 200) {
        sessionStorage.setItem("token", res.data.token);
        api.defaults.headers["authorization"] = "Bearer " + res.data.token;

        console.log("성공");
        setEmail("");
        setPassword("");
        setError("");

        navigate("/");
      } else {
        throw new Error(res.data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "로그인 중 오류가 발생했습니다";

        setError(message);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginTitle>SIGN IN</LoginTitle>
        <TextButton disableRipple onClick={() => navigate("/register")}>
          I DON'T HAVE AN ACCOUNT
        </TextButton>
        <AuthInput
          label="*Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="*Password"
          variant="outlined"
          type={checked ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <CheckboxWrapper>
          <HiddenCheckbox
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <StyledBox checked={checked} />
          Show password
        </CheckboxWrapper>

        <TextButton disableRipple>I FORGOT MY PASSWORD</TextButton>
        <ErrorText>{error}</ErrorText>

        <LoginButton onClick={handleLogin}>SIGN IN</LoginButton>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage;
