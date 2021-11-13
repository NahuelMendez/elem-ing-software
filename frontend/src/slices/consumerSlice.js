import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'consumerInfo',
  initialState: {
    consumer: {
      username: '',
      email: '',
      telephone: '',
      image: ''
    }
  },
  reducers: {
    setConsumerInfo: (state, action) => {
      state.consumer = action.payload;
    },
    deleteConsumerInfo: (state) => {
      state = {
        consumer: '',
        email: '',
        telephone: '',
        image: ''
      };
    }
  }
});

export const { setConsumerInfo, deleteConsumerInfo } = slice.actions;
export const consumerInfoState = (state) => state.consumerInfo.consumer;
export default slice.reducer;