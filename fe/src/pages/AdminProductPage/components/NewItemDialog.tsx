import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../features/store";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
} from "../../../features/product/productSlice";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";

interface Props {
  mode: "new" | "edit";
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct?: IProduct | null;
}

// 폼에서 사용할 데이터 타입
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

const SIZE = ["XS", "S", "M", "L", "XL"];
const STATUS = ["Active", "Inactive"];

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

  // --- 1. 상태 초기화 (any 없이 타입 안전하게 처리) ---
  const [formData, setFormData] = useState<ProductForm>(() => {
    if (mode === "edit" && selectedProduct) {
      // selectedProduct를 ProductForm으로 간주하여 필요한 값 추출
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

  const [stockError, setStockError] = useState(false);

  // --- 2. 주요 함수 ---
  const handleClose = () => {
    setStock([]);
    setStockError(false);
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

    if (stock.length === 0) {
      setStockError(true);
      return;
    }

    const stockObject: Record<string, number> = {};
    stock.forEach(([size, qty]) => {
      if (size && qty) {
        stockObject[size] = Number(qty);
      }
    });

    const submitData: ProductForm = {
      ...formData,
      stock: stockObject,
    };

    try {
      if (mode === "new") {
        await dispatch(createProduct(submitData)).unwrap();
      } else if (mode === "edit" && selectedProduct) {
        await dispatch(
          editProduct({
            id: selectedProduct._id,
            ...submitData,
          }),
        ).unwrap();
      }

      // ✅ 성공했을 때만 닫기
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  // --- 3. 사이드 이펙트 ---

  useEffect(() => {
    if (showDialog) {
      dispatch(clearError());
    }
  }, [showDialog, dispatch]);

  // --- 4. 재고 관리 로직 ---
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
  }, []); // 의존성 없음
  return (
    <Dialog open={showDialog} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "new" ? "Create Product" : "Edit Product"}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* 이미지 URL 입력 필드 추가 */}
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              Image
            </Typography>
            <CloudinaryUploadWidget uploadImage={uploadImage} />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              Stock
            </Typography>
            {stockError && (
              <Typography color="error" variant="caption">
                재고를 추가해주세요
              </Typography>
            )}
            <Button size="small" onClick={addStock} sx={{ mb: 1 }}>
              Add +
            </Button>
            {stock.map((item, index) => (
              <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                <Grid size={5}>
                  <TextField
                    select
                    fullWidth
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
                <Grid size={5}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Qty"
                    value={item[1]}
                    onChange={(e) => handleStockChange(e.target.value, index)}
                  />
                </Grid>
                <Grid size={2} sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton color="error" onClick={() => deleteStock(index)}>
                    X
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              type="number"
              label="Price"
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
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "new" ? "Submit" : "Edit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewItemDialog;
