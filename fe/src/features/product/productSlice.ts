import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../utils/api";

//
// 🔥 1. 타입 정의
//
export interface IProduct {
  _id: string;
  sku: string;
  name: string;
  price: number;
  stock: Record<string, number>; // 사이즈별 재고 구조
  image: string;
  status: string;
  description?: string;
  category?: string[];
}

interface ProductState {
  productList: IProduct[];
  selectedProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  productList: [],
  selectedProduct: null,
  loading: false,
  error: null,
  success: false,
};

//
// ✅ 2. 상품 리스트 조회
//
export const getProductList = createAsyncThunk<
  IProduct[],
  { name?: string } | undefined,
  { rejectValue: string }
>("product/getProductList", async (query, { rejectWithValue }) => {
  try {
    const response = await api.get("/product", {
      params: query,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("상품 리스트 가져오기 실패");
  }
});

//
// ✅ 3. 상품 생성
//
export const createProduct = createAsyncThunk<
  IProduct,
  Partial<IProduct>,
  { rejectValue: string }
>("product/createProduct", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/product", data);
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("상품 생성실패");
  }
});

//
// ✅ 4. 상품 수정
//
export const editProduct = createAsyncThunk<
  IProduct,
  { id: string } & Partial<IProduct>,
  { rejectValue: string }
>("product/editProduct", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/product/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("리스트 가져오기 실패");
  }
});

//
// ✅ 5. 상품 삭제
//
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("product/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${id}`);
    return id;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("상품 삭제 실패");
  }
});

//
// 🔥 6. Slice
//
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<IProduct | null>) {
      state.selectedProduct = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // =========================
      // 🔹 GET LIST
      // =========================
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "리스트 불러오기 실패";
      })

      // =========================
      // 🔹 CREATE
      // =========================
      .addCase(createProduct.fulfilled, (state, action) => {
        state.productList.unshift(action.payload);
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload || "생성 실패";
      })

      // =========================
      // 🔹 EDIT
      // =========================
      .addCase(editProduct.fulfilled, (state, action) => {
        state.productList = state.productList.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.error = action.payload || "수정 실패";
      })

      // =========================
      // 🔹 DELETE
      // =========================
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter(
          (item) => item._id !== action.payload,
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "삭제 실패";
      });
  },
});

//
// ✅ 7. export
//
export const { setSelectedProduct, clearError, resetSuccess } =
  productSlice.actions;

export default productSlice.reducer;
