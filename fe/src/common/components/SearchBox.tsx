import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useSearchParams } from "react-router";

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];

interface SearchBoxProps<T> {
  searchQuery: T;
  setSearchQuery: React.Dispatch<React.SetStateAction<T>>;
  placeholder: string;
  field: StringKeys<T>;
}

const SearchContainer = styled(TextField)({
  width: "20rem",
  "& .MuiOutlinedInput-root": {
    height: "2.65rem",
    borderRadius: 0,
    fontWeight: 300,

    "& input": {
      padding: "0 14px",
      height: "100%",
    },
  },
});

const SearchBox = <T extends { page?: number }>({
  searchQuery,
  setSearchQuery,
  placeholder,
  field,
}: SearchBoxProps<T>) => {
  const [query] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    query.get(field as string) || "",
  );

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchQuery((prev) => ({
        ...prev,
        [field]: keyword,
        page: 1,
      }));
    }
  };

  return (
    <SearchContainer
      placeholder={placeholder}
      onKeyDown={onCheckEnter}
      onChange={(event) => setKeyword(event.target.value)}
      value={keyword}
    />
  );
};

export default SearchBox;
