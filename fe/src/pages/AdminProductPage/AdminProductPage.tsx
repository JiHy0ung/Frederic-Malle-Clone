import { Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../features/store";

import ProductTable from "./components/ProductTable";
import NewItemDialog from "./components/NewItemDialog";

import {
  deleteProduct,
  getProductList,
  setSelectedProduct,
  type IProduct,
} from "../../features/product/productSlice";

const PageWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignContent: "center",
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  padding: "3rem",
});

const HeaderSection = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "2rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "3rem",
});

const ControlBox = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
});

const SearchBox = styled(TextField)({
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

const AddButton = styled(Button)({
  fontSize: "0.675rem",
  height: "2.65rem",
  backgroundColor: "#000",
  color: "#fff",
  borderRadius: 0,
  fontWeight: 300,
  padding: "0 2rem",
  whiteSpace: "nowrap",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#eb3300",
  },
});

const AdminProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { productList, selectedProduct } = useSelector(
    (state: RootState) => state.product,
  );

  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    dispatch(getProductList({ name: searchName }));
  }, [searchName, dispatch]);

  const deleteItem = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const openEditForm = (product: IProduct) => {
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode("new");
    setShowDialog(true);
  };

  return (
    <PageWrapper>
      <HeaderSection>
        <ControlBox>
          <SearchBox
            variant="outlined"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <AddButton onClick={handleClickNewItem}>ADD PRODUCT</AddButton>
        </ControlBox>
      </HeaderSection>

      <ProductTable
        data={productList}
        deleteItem={deleteItem}
        openEditForm={openEditForm}
      />

      <NewItemDialog
        key={
          mode === "edit" && selectedProduct ? selectedProduct._id : "new-item"
        }
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedProduct={selectedProduct}
      />
    </PageWrapper>
  );
};

export default AdminProductPage;
