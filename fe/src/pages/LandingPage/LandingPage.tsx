import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../features/store";
import { getProductList } from "../../features/product/productSlice";
import ProductCard from "./components/ProductCard";

const Container = styled(Box)({
  padding: "60px 80px",
  display: "flex",
  flexWrap: "wrap",
  gap: "40px",
  justifyContent: "center",
});

const LandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productList, loading, error } = useSelector(
    (state: RootState) => state.product,
  );

  console.log("productList", productList);

  useEffect(() => {
    dispatch(getProductList({ page: 1, limit: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ marginTop: 10 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container>
      {productList.map((product) => (
        <ProductCard
          key={product._id}
          image={product.image}
          name={product.name}
          price={product.price}
        />
      ))}
    </Container>
  );
};

export default LandingPage;
