import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'searchResults',
  initialState: {
    results: []
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload
    }
  }
});

export const { setSearchResults } = slice.actions;
export const searchState = (state) => state.searchResults.results;
export default slice.reducer;