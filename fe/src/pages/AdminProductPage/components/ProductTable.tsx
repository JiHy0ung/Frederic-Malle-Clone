import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
} from "@mui/material";

import type { IProduct } from "../../../features/product/productSlice";

interface Props {
  header?: string[];
  data: IProduct[];
  deleteItem: (id: string) => void;
  openEditForm: (product: IProduct) => void;
}

const ProductTable: React.FC<Props> = ({ data, deleteItem, openEditForm }) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography>등록된 상품이 없습니다.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item?._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item?.sku}</TableCell>
                <TableCell>{item?.name}</TableCell>

                <TableCell>
                  {item?.category?.length ? item?.category?.join(", ") : "-"}
                </TableCell>

                <TableCell>₩ {item?.price?.toLocaleString()}</TableCell>

                <TableCell>
                  {Object.entries(item?.stock || {}).map(([size, qty]) => (
                    <Typography key={`${item._id}-${size}`} variant="body2">
                      {size.toUpperCase()} : {qty}
                    </Typography>
                  ))}
                </TableCell>

                <TableCell>
                  {item?.image ? (
                    <Box
                      component="img"
                      src={item?.image}
                      alt={item?.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={item?.status}
                    color={item?.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => openEditForm(item)}
                  >
                    Edit
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => deleteItem(item?._id)}
                  >
                    Delete
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
