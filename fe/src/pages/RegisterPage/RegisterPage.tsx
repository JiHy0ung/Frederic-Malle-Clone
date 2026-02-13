import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/api";

const RegisterContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "3.125rem",
});

const RegisterBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  width: "28.125rem",
  gap: "1rem",
});

const RegisterTitle = styled(Typography)({
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

const RegisterButton = styled(Button)({
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      if (password !== confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      const res = await api.post("/user", {
        name,
        email,
        password,
      });

      if (res.status === 200) {
        navigate("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>NEW CUSTOMER</RegisterTitle>
        <TextButton disableRipple onClick={() => navigate("/login")}>
          LOG IN NOW
        </TextButton>
        <AuthInput
          label="*Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthInput
          label="*Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="*Password"
          variant="outlined"
          value={password}
          type={checked ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthInput
          label="*Confirm Password"
          variant="outlined"
          value={confirmPassword}
          type={checked ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <ErrorText>{error}</ErrorText>
        <RegisterButton onClick={handleSubmit}>SIGN IN</RegisterButton>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default RegisterPage;
