import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      const query = action.payload
      return query
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer