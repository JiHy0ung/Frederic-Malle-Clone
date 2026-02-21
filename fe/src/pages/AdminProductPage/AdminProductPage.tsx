import { Box, Button, Pagination } from "@mui/material";
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
import SearchBox from "../../common/components/SearchBox";
import { useNavigate, useSearchParams } from "react-router";

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

const CustomPagination = styled(Pagination)({
  "& .Mui-selected": {
    backgroundColor: "#eb3300 !important",
    color: "#fff",
  },

  "& .MuiPaginationItem-root:hover": {
    backgroundColor: "#eb330020",
  },
});

interface ProductSearchQuery {
  page?: number;
  name?: string;
}

const AdminProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { productList, selectedProduct, totalPageNum } = useSelector(
    (state: RootState) => state.product,
  );

  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");

  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<ProductSearchQuery>({
    page: Number(query.get("page")) || 1,
    name: query.get("name") || undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const updatedQuery = { ...searchQuery };

    if (updatedQuery.name === "") {
      delete updatedQuery.name;
    }

    const params = new URLSearchParams(
      Object.entries(updatedQuery).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>,
      ),
    );

    const queryString = params.toString();
    navigate(`?${queryString}`, { replace: true });
  }, [searchQuery, navigate]);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchQuery((prev) => ({
      ...prev,
      page: value,
    }));
  };

  return (
    <PageWrapper>
      <HeaderSection>
        <ControlBox>
          <SearchBox
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />

          <AddButton onClick={handleClickNewItem}>ADD PRODUCT</AddButton>
        </ControlBox>
      </HeaderSection>

      <ProductTable
        data={productList}
        deleteItem={deleteItem}
        openEditForm={openEditForm}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CustomPagination
          count={totalPageNum}
          page={searchQuery.page || 1}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

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
