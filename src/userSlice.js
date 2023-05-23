import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userslice',
  initialState: {
    username: '',
  },
  reducers: {
    setUser(state, action) {
      state.username = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const {setUser} = actions
export default reducer;
