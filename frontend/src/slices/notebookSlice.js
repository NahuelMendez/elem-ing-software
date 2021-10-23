import { createSlice, current } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'notebookInfo',
  initialState: {
    products: []
  },
  reducers: {
    addProduct: (state, action) => {
      const  products = current(state).products
      const productToAdd = products.find(product => product.name === action.payload.name)
      if (productToAdd === undefined) {
        state.products = [...products, { ...action.payload, cant: 1 }]
      }
      else {
        const productsClean = products.filter(product => product.name !== action.payload.name || product.pizzeriaName !== action.payload.pizzeriaName)
        state.products = [...productsClean, { ...action.payload, cant: productToAdd.cant + 1 }]
      }
    },
    removeProduct: (state, action) => {
      const  products = current(state).products
      const productsClean = products.filter(product => product.name !== action.payload.name || product.pizzeriaName !== action.payload.pizzeriaName)
      state.products = productsClean
    },
    removeAllFromPizzeria: (state, action) => {
      const  products = current(state).products
      const productsClean = products.filter(product => product.pizzeriaName !== action.payload)
      state.products = productsClean
    }
  }
});

export const { addProduct, removeProduct, removeAllFromPizzeria } = slice.actions;
export const productsState = (state) => state.notebookInfo.products;
export default slice.reducer;