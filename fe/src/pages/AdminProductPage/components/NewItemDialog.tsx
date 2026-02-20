import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../features/store";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  createProduct,
  editProduct,
  clearError,
  type IProduct,
  getProductList,
} from "../../../features/product/productSlice";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { Delete, Plus } from "lucide-react";

interface Props {
  mode: "new" | "edit";
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct?: IProduct | null;
}

interface ProductForm {
  name: string;
  sku: string;
  stock: Record<string, number>;
  image: string;
  description: string;
  category: string[];
  status: string;
  price: number;
}

const SIZE = ["100ml", "50ml", "10ml"];
const STATUS = ["Active", "Inactive"];
const CATEGORY_OPTIONS = ["PERFUME", "BODY", "HOME"];

const InitialFormData: ProductForm = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

const NewItemDialog: React.FC<Props> = ({
  mode,
  showDialog,
  setShowDialog,
  selectedProduct,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<ProductForm>(() => {
    if (mode === "edit" && selectedProduct) {
      const p = selectedProduct as unknown as ProductForm;
      return {
        ...InitialFormData,
        ...p,
        description: p.description ?? "",
        category: p.category ?? [],
        image: p.image ?? "",
      };
    }
    return InitialFormData;
  });

  const [stock, setStock] = useState<[string, string][]>(() => {
    if (mode === "edit" && selectedProduct?.stock) {
      return Object.entries(selectedProduct.stock).map(([size, qty]) => [
        size,
        String(qty),
      ]);
    }
    return [];
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleClose = () => {
    setStock([]);
    setValidationErrors([]);
    setFormData(InitialFormData);
    setShowDialog(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 유효성 검사
    const errors: string[] = [];
    if (!formData.sku) errors.push("SKU를 입력해주세요");
    if (!formData.name) errors.push("상품명을 입력해주세요");
    if (!formData.price) errors.push("가격을 입력해주세요");
    if (stock.length === 0) errors.push("재고를 추가해주세요");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const stockObject: Record<string, number> = {};
    stock.forEach(([size, qty]) => {
      if (size && qty) {
        stockObject[size] = Number(qty);
      }
    });

    const submitData: ProductForm = { ...formData, stock: stockObject };

    try {
      if (mode === "new") {
        await dispatch(createProduct(submitData)).unwrap();
        await dispatch(getProductList({ name: "" }));
      } else if (mode === "edit" && selectedProduct) {
        await dispatch(
          editProduct({ id: selectedProduct._id, ...submitData }),
        ).unwrap();
        await dispatch(getProductList({ name: "" }));
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showDialog) {
      dispatch(clearError());
    }
  }, [showDialog, dispatch]);

  const addStock = () => setStock((prev) => [...prev, ["", ""]]);
  const deleteStock = (index: number) =>
    setStock((prev) => prev.filter((_, i) => i !== index));
  const handleSizeChange = (value: string, index: number) => {
    const updated = [...stock];
    updated[index][0] = value;
    setStock(updated);
  };
  const handleStockChange = (value: string, index: number) => {
    const updated = [...stock];
    updated[index][1] = value;
    setStock(updated);
  };

  const uploadImage = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  }, []);

  return (
    <Dialog
      open={showDialog}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 0 } }}
    >
      <DialogTitle
        sx={{ px: 3, pt: 3, pb: 1, fontWeight: "medium", fontSize: "1.5rem" }}
      >
        {mode === "new" ? "New Product" : "Edit Product"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "black" },
            "&.Mui-focused fieldset": {
              borderColor: "black",
              borderWidth: "1px",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "black" },
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          상품의 상세 정보를 입력하고 재고를 관리하세요.
        </Typography>

        {(error || validationErrors.length > 0) && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {validationErrors.length > 0 ? validationErrors[0] : error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  error={validationErrors.some((e) => e.includes("sku"))}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={validationErrors.some((e) => e.includes("상품명"))}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Product Image
            </Typography>
            <CloudinaryUploadWidget uploadImage={uploadImage} />
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                bgcolor: "grey.50",
              }}
            >
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category:
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value,
                }))
              }
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (selected as string[]).join(", "),
              }}
              size="small"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                mt: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                Stock
                <Typography variant="caption" color="text.secondary">
                  (Size & Stock)
                </Typography>
              </Typography>
              <Button
                startIcon={<Plus strokeWidth={1.5} size={"1rem"} />}
                onClick={addStock}
                sx={{
                  color: "white",
                  px: 3,
                  fontWeight: "light",
                  fontSize: "0.75rem",
                  borderRadius: 0,
                  backgroundColor: "#eb3300",
                }}
              >
                Add Stock
              </Button>
            </Box>

            {stock.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  재고 정보가 없습니다. 버튼을 눌러 사이즈별 수량을 추가하세요.
                </Typography>
              </Box>
            ) : (
              stock.map((item, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <Grid size={{ xs: 5 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Size"
                      value={item[0]}
                      onChange={(e) => handleSizeChange(e.target.value, index)}
                    >
                      {SIZE.map((size) => (
                        <MenuItem key={size} value={size.toLowerCase()}>
                          {size}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 5 }}>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      label="Quantity"
                      placeholder="0"
                      value={item[1]}
                      onChange={(e) => handleStockChange(e.target.value, index)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 2 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      color="error"
                      onClick={() => deleteStock(index)}
                      size="small"
                      sx={{
                        height: "2.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "light",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Delete strokeWidth={1} size={"1.5rem"} />
                    </Button>
                  </Grid>
                </Grid>
              ))
            )}
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              type="number"
              label="Price (₩)"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {STATUS.map((s) => (
                <MenuItem key={s} value={s.toLowerCase()}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            px: 4,

            fontSize: "0.75rem",
            fontWeight: "light",
            color: "white",
            backgroundColor: "black",
            borderRadius: 0,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            px: 4,
            fontWeight: "light",
            fontSize: "0.75rem",
            color: "white",
            backgroundColor: "#eb3300",
            boxShadow: "none",
            borderRadius: 0,
            "&:hover": { boxShadow: "none" },
          }}
        >
          {mode === "new" ? "Create Product" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewItemDialog;
