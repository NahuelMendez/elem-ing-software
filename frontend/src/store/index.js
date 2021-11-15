import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../slices/searchSlice'
import notebookReducer from '../slices/notebookSlice';
import consumerReducer from '../slices/consumerSlice';

export default configureStore({
  reducer: {
    searchResults: searchReducer,
    notebookInfo: notebookReducer,
    consumerInfo: consumerReducer
  },
});
