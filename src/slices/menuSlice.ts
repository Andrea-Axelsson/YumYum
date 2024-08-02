import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';


export interface DishItem {
  id: string;
  description: string;
  dishname: string;
  price: number;
}

export interface MenuState {
  items: DishItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MenuState = {
  items: [],
  status: 'idle',
};

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
  const menuCollectionRef = collection(db, 'menu');
  const querySnapshot = await getDocs(menuCollectionRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DishItem[];
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default menuSlice.reducer;


