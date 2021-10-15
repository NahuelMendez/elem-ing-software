import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'notebookInfo',
  initialState: {
    products: [],
    total: 0
  },
  reducers: {
    addProduct: (state, action) => {
      const productToAdd = state.products.find(i => i.name === action.payload.name)
      state.total = state.total + action.payload.price
      if (!productToAdd) {
        state.products = [...state.products, action.payload]
      }
      else {
        const productsCopy = state.products.splice(state.products.indexOf(productToAdd), 1);
        state.products = [...productsCopy, { ...action.payload, cant: productToAdd.cant }]
      }
    }
  }
});

export const { addProduct } = slice.actions;
export const productsState = (state) => state.notebookInfo.products;
export const totalState = (state) => state.notebookInfo.total;
export default slice.reducer;