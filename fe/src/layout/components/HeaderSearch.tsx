import { TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const HeaderSearch = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/search?name=${keyword}`);
    }
  };

  return (
    <TextField
      variant="standard"
      placeholder="Search..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={handleEnter}
      sx={{
        input: { color: "white" },
        "& .MuiInput-underline:before": { borderBottomColor: "white" },
        "& .MuiInput-underline:after": { borderBottomColor: "#eb3300" },
      }}
    />
  );
};

export default HeaderSearch;
