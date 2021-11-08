import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'searchResults',
  initialState: {
    searchText: '',
    results: []
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.searchText = action.payload.searchText
      state.results = action.payload.results
    }
  }
});

export const { setSearchResults } = slice.actions;
export const searchTextState = (state) => state.searchResults.searchText;
export const searchState = (state) => state.searchResults.results;
export default slice.reducer;