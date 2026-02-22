import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";

interface ProductCardProps {
  _id: string;
  image: string;
  name: string;
  price: number;
}

const StyledCard = styled(Card)({
  width: "280px",
  borderRadius: 0,
  boxShadow: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
});

const StyledImage = styled(CardMedia)({
  aspectRatio: "1 / 1",
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "transform 0.4s ease",
});

const ProductCard = ({ _id, image, name, price }: ProductCardProps) => {
  const navigate = useNavigate();
  return (
    <StyledCard onClick={() => navigate(`/product/${_id}`)}>
      <StyledImage image={image} />
      <CardContent sx={{ padding: "16px 0" }}>
        <Typography sx={{ fontWeight: 500, marginBottom: "4px" }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#eb3300" }}>
          ₩ {price.toLocaleString()}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;
