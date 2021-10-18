import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../slices/searchSlice'
import notebookReducer from '../slices/notebookSlice';

export default configureStore({
  reducer: {
    searchResults: searchReducer,
    notebookInfo: notebookReducer
  },
});
