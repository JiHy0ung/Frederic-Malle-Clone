import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { AppDispatch, RootState } from "../../features/store";
import { getProductDetail } from "../../features/product/productSlice";

const PageWrapper = styled(Box)({
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "center",
  padding: "6rem 2rem",
});

const Inner = styled(Box)({
  maxWidth: "1100px",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6rem",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    gap: "3rem",
  },
});

const ProductImage = styled("img")({
  width: "100%",
  aspectRatio: "3 / 4",
  objectFit: "cover",
});

const RightPanel = styled(Box)({
  display: "flex",
  flexDirection: "column",
  paddingTop: "1rem",
});

const Label = styled(Typography)({
  fontSize: "0.65rem",
  letterSpacing: "0.15em",
  color: "#999",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
});

const ProductName = styled(Typography)({
  fontSize: "1.6rem",
  fontWeight: 300,
  letterSpacing: "0.08em",
  lineHeight: 1.3,
  color: "#111",
  textTransform: "uppercase",
  marginBottom: "1.5rem",
});

const PriceText = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 300,
  letterSpacing: "0.05em",
  color: "#111",
  marginBottom: "2.5rem",
});

const SizeButton = styled("button")<{ $selected: boolean }>(
  ({ $selected }) => ({
    width: "60px",
    height: "36px",
    border: $selected ? "1px solid #111" : "1px solid #ddd",
    backgroundColor: $selected ? "#111" : "#fff",
    color: $selected ? "#fff" : "#111",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#111",
    },
    "&:disabled": {
      color: "#ccc",
      borderColor: "#eee",
      cursor: "not-allowed",
      backgroundColor: "#fafafa",
    },
  }),
);

const QtyButton = styled(IconButton)({
  padding: "4px",
  borderRadius: 0,
  color: "#111",
  "&:hover": { color: "#eb3300" },
});

const QtyDisplay = styled(Typography)({
  width: "36px",
  textAlign: "center",
  fontSize: "0.85rem",
  fontWeight: 300,
});

const ActionButton = styled("button")<{ $variant?: "outline" }>(
  ({ $variant }) => ({
    width: "100%",
    height: "48px",
    border: "1px solid #111",
    backgroundColor: $variant === "outline" ? "#fff" : "#111",
    color: $variant === "outline" ? "#111" : "#fff",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: "#eb3300",
      borderColor: "#eb3300",
      color: "#fff",
    },
  }),
);

const DescriptionText = styled(Typography)({
  fontSize: "0.78rem",
  fontWeight: 300,
  lineHeight: 1.9,
  color: "#555",
  letterSpacing: "0.03em",
  whiteSpace: "pre-line",
});

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // id가 바뀌면 초기값도 자동으로 리셋됨
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct: product, loading } = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    if (id) dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: "10rem" }}>
        <Typography
          sx={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#999" }}
        >
          LOADING...
        </Typography>
      </Box>
    );
  }

  if (!product) return null;

  const stockEntries = Object.entries(product.stock || {});
  const maxQty = selectedSize ? (product.stock[selectedSize] ?? 0) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return alert("사이즈를 선택해주세요.");
    // TODO: cart dispatch
    console.log({ productId: product._id, size: selectedSize, qty });
  };

  const handleBuyNow = () => {
    if (!selectedSize) return alert("사이즈를 선택해주세요.");
    // TODO: 결제 페이지로 이동
  };

  return (
    <PageWrapper>
      <Inner>
        {/* 이미지 */}
        <Box>
          <ProductImage src={product.image} alt={product.name} />
        </Box>

        {/* 정보 */}
        <RightPanel>
          {product.category && <Label>{product.category.join(" / ")}</Label>}

          <ProductName>{product.name}</ProductName>

          <PriceText>₩ {product.price.toLocaleString()}</PriceText>

          <Divider sx={{ mb: 3, borderColor: "#eee" }} />

          {/* 사이즈 선택 */}
          {stockEntries.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Label sx={{ mb: 1.5 }}>
                SIZE {selectedSize ? `— ${selectedSize.toUpperCase()}` : ""}
              </Label>
              <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {stockEntries.map(([size, stock]) => (
                  <SizeButton
                    key={size}
                    $selected={selectedSize === size}
                    disabled={stock === 0}
                    onClick={() => {
                      setSelectedSize(size);
                      setQty(1);
                    }}
                  >
                    {size.toUpperCase()}
                  </SizeButton>
                ))}
              </Box>
            </Box>
          )}

          {/* 수량 선택 */}
          <Box sx={{ mb: 3 }}>
            <Label sx={{ mb: 1.5 }}>QUANTITY</Label>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <QtyButton
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                <Minus size={14} />
              </QtyButton>
              <QtyDisplay>{qty}</QtyDisplay>
              <QtyButton
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={!selectedSize || qty >= maxQty}
              >
                <Plus size={14} />
              </QtyButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#eee" }} />

          {/* 버튼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              mb: 4,
            }}
          >
            <ActionButton onClick={handleBuyNow}>Purchase Now</ActionButton>
            <ActionButton $variant="outline" onClick={handleAddToCart}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <ShoppingBag size={14} />
                Add to Cart
              </Box>
            </ActionButton>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#eee" }} />

          {/* 설명 */}
          {product.description && (
            <Box>
              <Label sx={{ mb: 1.5 }}>Description</Label>
              <DescriptionText>{product.description}</DescriptionText>
            </Box>
          )}
        </RightPanel>
      </Inner>
    </PageWrapper>
  );
};

export default ProductDetailPage;
