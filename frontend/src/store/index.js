import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../slices/searchSlice'

export default configureStore({
  reducer: {
    searchResults: searchReducer
  },
});
