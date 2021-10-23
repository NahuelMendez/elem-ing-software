import { createSlice, current } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'notebookInfo',
  initialState: {
    products: []
  },
  reducers: {
    addProduct: (state, action) => {
      const  products = current(state).products
      const productToAdd = products.find(i => i.name === action.payload.name)
      if (productToAdd === undefined) {
        state.products = [...products, { ...action.payload, cant: 1 }]
      }
      else {
        const productsClean = products.filter(i => i.name !== action.payload.name || i.pizzeriaName !== action.payload.pizzeriaName)
        state.products = [...productsClean, { ...action.payload, cant: productToAdd.cant + 1 }]
      }
    },
    removeProduct: (state, action) => {
      const  products = current(state).products
      const productsClean = products.filter(i => i.name !== action.payload.name || i.pizzeriaName !== action.payload.pizzeriaName)
      state.products = productsClean
    }
  }
});

export const { addProduct, removeProduct } = slice.actions;
export const productsState = (state) => state.notebookInfo.products;
export default slice.reducer;