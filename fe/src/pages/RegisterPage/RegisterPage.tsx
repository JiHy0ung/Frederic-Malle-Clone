import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../../features/user/userSlice";
import type { AppDispatch, RootState } from "../../features/store";

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
  fontWeight: 500,
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
    background: "none",
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

    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #666",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #000",
    },
  },

  "& .MuiOutlinedInput-root.Mui-error": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #EE0000",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #EE0000",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #EE0000",
    },
  },

  "& .MuiInputLabel-root": {
    fontSize: "12px",
    color: "#666",
    top: "50%",
    transform: "translate(14px, -50%) scale(1)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",

    "&.Mui-focused": {
      color: "#000",
    },

    "&.Mui-error": {
      color: "#EE0000",
    },
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
  userSelect: "none",
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
  flexShrink: 0,
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: "#EE0000",
  },

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
  minHeight: "0.75rem",
  fontSize: "0.75rem",
  color: "#EE0000",
  marginTop: "-0.5rem",
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
  fontWeight: 500,
  transition: "all 0.3s ease",

  "&:hover": {
    backgroundColor: "#CC0000",
  },

  "&:disabled": {
    backgroundColor: "#999",
    color: "#fff",
    cursor: "not-allowed",
  },
});

const StyledForm = styled("form")({
  display: "contents",
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { registrationError, loading } = useSelector(
    (state: RootState) => state.user,
  );

  const [checked, setChecked] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (passwordError) setPasswordError("");
    if (registrationError) dispatch(clearErrors());

    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: false });
    }
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    const errors = {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (!name.trim()) {
      setPasswordError("이름을 입력해주세요.");
      errors.name = true;
      setFieldErrors(errors);
      return false;
    }

    if (!email.trim()) {
      setPasswordError("이메일을 입력해주세요.");
      errors.email = true;
      setFieldErrors(errors);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPasswordError("올바른 이메일 형식이 아닙니다.");
      errors.email = true;
      setFieldErrors(errors);
      return false;
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      errors.password = true;
      setFieldErrors(errors);
      return false;
    }

    if (password.length < 5) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다.");
      errors.password = true;
      setFieldErrors(errors);
      return false;
    }

    if (!confirmPassword) {
      setPasswordError("비밀번호 확인을 입력해주세요.");
      errors.confirmPassword = true;
      setFieldErrors(errors);
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      errors.password = true;
      errors.confirmPassword = true;
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors(errors);
    return true;
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    const { name, email, password } = formData;
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch(() => {});
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>NEW CUSTOMER</RegisterTitle>
        <TextButton disableRipple onClick={() => navigate("/login")}>
          LOG IN NOW
        </TextButton>

        <StyledForm onSubmit={handleRegister}>
          <AuthInput
            label="*Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={fieldErrors.name}
            disabled={loading}
          />
          <AuthInput
            label="*Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={fieldErrors.email}
            disabled={loading}
          />
          <AuthInput
            label="*Password"
            variant="outlined"
            value={formData.password}
            type={checked ? "text" : "password"}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={fieldErrors.password}
            disabled={loading}
          />
          <AuthInput
            label="*Confirm Password"
            variant="outlined"
            value={formData.confirmPassword}
            type={checked ? "text" : "password"}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={fieldErrors.confirmPassword}
            disabled={loading}
          />
          <CheckboxWrapper>
            <HiddenCheckbox
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              disabled={loading}
            />
            <StyledBox checked={checked} />
            Show password
          </CheckboxWrapper>
          <ErrorText>{passwordError || registrationError}</ErrorText>
          <RegisterButton type="submit" disabled={loading}>
            {loading ? "처리 중..." : "SIGN UP"}
          </RegisterButton>
        </StyledForm>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default RegisterPage;
