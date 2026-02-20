import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Pencil, Trash2 } from "lucide-react";

import type { IProduct } from "../../../features/product/productSlice";

const StyledTableContainer = styled(TableContainer)({
  width: "100%",
  backgroundColor: "#fff",
});

const StyledTableHead = styled(TableHead)({
  borderBottom: "1px solid #eaeaea",
});

const StyledHeaderCell = styled(TableCell)({
  fontWeight: 400,
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  color: "#888",
  borderBottom: "1px solid #eaeaea",
});

const StyledRow = styled(TableRow)({
  borderBottom: "1px solid #f3f3f3",
  transition: "background 0.2s ease",
  "&:hover": {
    backgroundColor: "#fafafa",
  },
});

const StyledCell = styled(TableCell)({
  borderBottom: "none",
  fontWeight: 300,
  fontSize: "0.75rem",
});

const StatusText = styled(Typography)<{ $active: boolean }>(({ $active }) => ({
  fontSize: "0.85rem",
  letterSpacing: "0.05em",
  color: $active ? "#000" : "#bbb",
}));

interface Props {
  data: IProduct[];
  deleteItem: (id: string) => void;
  openEditForm: (product: IProduct) => void;
}

const ProductTable: React.FC<Props> = ({ data, deleteItem, openEditForm }) => {
  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledHeaderCell>#</StyledHeaderCell>
            <StyledHeaderCell>SKU</StyledHeaderCell>
            <StyledHeaderCell>NAME</StyledHeaderCell>
            <StyledHeaderCell>CATEGORY</StyledHeaderCell>
            <StyledHeaderCell>PRICE</StyledHeaderCell>
            <StyledHeaderCell>STOCK</StyledHeaderCell>
            <StyledHeaderCell>IMAGE</StyledHeaderCell>
            <StyledHeaderCell>STATUS</StyledHeaderCell>
            <StyledHeaderCell>ACTIONS</StyledHeaderCell>
          </TableRow>
        </StyledTableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography sx={{ py: 6, color: "#999" }}>
                  No products available.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <StyledRow key={item?._id ?? index}>
                <StyledCell>{index + 1}</StyledCell>
                <StyledCell>{item?.sku}</StyledCell>
                <StyledCell sx={{ fontWeight: 400 }}>{item?.name}</StyledCell>

                <StyledCell>
                  {item?.category?.length ? item?.category?.join(", ") : "-"}
                </StyledCell>

                <StyledCell align="center">
                  ₩ {item?.price?.toLocaleString()}
                </StyledCell>

                <StyledCell>
                  {Object.entries(item?.stock || {}).map(([size, qty]) => (
                    <Typography
                      key={`${item._id}-${size}`}
                      variant="body2"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {size.toUpperCase()} · {qty}
                    </Typography>
                  ))}
                </StyledCell>

                <StyledCell>
                  {item?.image ? (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 0,
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </StyledCell>

                <StyledCell>
                  <StatusText $active={item?.status === "active"}>
                    {item?.status?.toUpperCase()}
                  </StatusText>
                </StyledCell>

                <StyledCell align="center">
                  <IconButton
                    onClick={() => openEditForm(item)}
                    sx={{
                      color: "#000",
                      "&:hover": { color: "#eb3300" },
                    }}
                  >
                    <Pencil size={16} />
                  </IconButton>

                  <IconButton
                    onClick={() => deleteItem(item?._id)}
                    sx={{
                      color: "#999",
                      "&:hover": { color: "#eb3300" },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </StyledCell>
              </StyledRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default ProductTable;
