import { configureStore } from '@reduxjs/toolkit'
import { loginSlice } from './loginSlice'
import { cartSlice } from './cartSlice'
import { wishlistSlice } from './wishlistSlice'

export const store = configureStore({
  reducer: {
    authStore:loginSlice.reducer,
    cartStore: cartSlice.reducer,
    wishlistStore: wishlistSlice.reducer,
  },
})
