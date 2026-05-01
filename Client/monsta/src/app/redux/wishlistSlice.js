import { createSlice } from "@reduxjs/toolkit";

const getStoredWishlist = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("monsta_wishlist") || "[]");
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("monsta_wishlist", JSON.stringify(items));
};

const getProductPrice = (product) =>
  Number(product?._productSalePrice || product?._productPrice || 0);

const buildWishlistItem = (product) => ({
  id: product?._id,
  slug: product?.slug,
  name: product?._productName,
  image: product?.imagePath || "/table.jpg",
  price: getProductPrice(product),
  regularPrice: Number(product?._productPrice || 0),
  stock: Number(product?._productStock || 0),
  selectedColor: product?._productColor?.[0] || "",
  selectedMaterial: product?._productMaterial?.[0]?._materialName || "",
  product,
});

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: getStoredWishlist(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const item = buildWishlistItem(product);

      if (item.id && !state.items.some((wishlistItem) => wishlistItem.id === item.id)) {
        state.items.push(item);
      }

      saveWishlist(state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlistStore.items;
export const selectWishlistCount = (state) => state.wishlistStore.items.length;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlistStore.items.some((item) => item.id === productId);

export default wishlistSlice.reducer;
