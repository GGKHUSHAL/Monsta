import { createSlice } from "@reduxjs/toolkit";

const getStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("monsta_cart") || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("monsta_cart", JSON.stringify(items));
};

const getCartItemId = (item) =>
  [item.productId, item.selectedColor || "", item.selectedMaterial || ""].join("|");

const getProductPrice = (product) =>
  Number(product?._productSalePrice || product?._productPrice || 0);

const buildCartItem = (product, quantity = 1, selectedColor = "", selectedMaterial = "") => ({
  id: getCartItemId({
    productId: product?._id,
    selectedColor,
    selectedMaterial,
  }),
  productId: product?._id,
  slug: product?.slug,
  name: product?._productName,
  image: product?.imagePath || "/table.jpg",
  price: getProductPrice(product),
  regularPrice: Number(product?._productPrice || 0),
  quantity: Number(quantity) || 1,
  stock: Number(product?._productStock || 999),
  selectedColor,
  selectedMaterial,
});

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getStoredCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, selectedColor = "", selectedMaterial = "" } =
        action.payload || {};
      const newItem = buildCartItem(product, quantity, selectedColor, selectedMaterial);
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.stock || 999
        );
      } else if (newItem.productId) {
        state.items.push(newItem);
      }

      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload || {};
      const item = state.items.find((cartItem) => cartItem.id === id);

      if (item) {
        item.quantity = Math.max(1, Math.min(Number(quantity) || 1, item.stock || 999));
      }

      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cartStore.items;
export const selectCartCount = (state) =>
  state.cartStore.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
export const selectCartSubtotal = (state) =>
  state.cartStore.items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
export const selectCartItemByProductOptions =
  (productId, selectedColor = "", selectedMaterial = "") =>
  (state) =>
    state.cartStore.items.find(
      (item) =>
        item.id ===
        getCartItemId({
          productId,
          selectedColor,
          selectedMaterial,
        })
    );

export default cartSlice.reducer;
