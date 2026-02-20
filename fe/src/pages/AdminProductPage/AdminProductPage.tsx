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

const ProductContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  gap: "1rem",
});

const SearchBox = styled(TextField)({
  width: "30rem",
});

const AdminProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { productList, selectedProduct } = useSelector(
    (state: RootState) => state.product,
  );

  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [searchName, setSearchName] = useState("");

  // ✅ 검색어 바뀔 때마다 리스트 가져오기
  useEffect(() => {
    dispatch(getProductList({ name: searchName }));
  }, [searchName, dispatch]);

  // 삭제
  const deleteItem = (id: string) => {
    dispatch(deleteProduct(id));
  };

  // 수정 열기
  const openEditForm = (product: IProduct) => {
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  // 새 상품 추가
  const handleClickNewItem = () => {
    setMode("new");
    setShowDialog(true);
  };

  return (
    <ProductContainer>
      <SearchBox
        placeholder="제품 이름으로 검색"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <Button variant="contained" onClick={handleClickNewItem}>
        새 상품 추가하기
      </Button>

      <ProductTable
        header={["#", "Sku", "Name", "Price", "Stock", "Image", "Status", ""]}
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
    </ProductContainer>
  );
};

export default AdminProductPage;
