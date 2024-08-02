import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {collection, query, where, getDocs, addDoc, updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase-config'

export interface OrderItem {
    id: string;
    description: string;
    dishname: string;
    price: number;
    quantity: number;
  }

  export interface OrderState {
    items: OrderItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  const initialState: OrderState = {
    items: [],
    status: 'idle',
    error: null,
  };


  export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async () => {
      try {
        const orderCollectionRef = collection(db, 'orders');
        const querySnapshot = await getDocs(orderCollectionRef);
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as OrderItem[];
        return orders;
      } catch (error) {
        console.error('Error fetching orders from firestore', error);
        throw error;
      }
    }
  );

  export const addToOrder = createAsyncThunk(
    'order/addToOrder',
    async (item: Omit<OrderItem, 'id'>) => {
      try {
        const orderCollectionRef = collection(db, 'orders');
        const q = query(orderCollectionRef, where('dishname', '==', item.dishname));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Varan finns redan, uppdatera kvantiteten
          const existingDoc = querySnapshot.docs[0];
          const existingData = existingDoc.data() as OrderItem;
          const newQuantity = existingData.quantity + 1;
          const docRef = doc(db, 'orders', existingDoc.id);
          await updateDoc(docRef, { quantity: newQuantity });
          return { ...existingData, quantity: newQuantity, id: existingDoc.id };
        } else {
          // Varan finns inte, lägg till ny post
          const docRef = await addDoc(orderCollectionRef, item);
          return { ...item, id: docRef.id };
        }
      } catch (error) {
        console.error('Error adding to firestore', error);
        throw error;
      }
    }
  );


  const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addItemToOrder: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if(existingItem){
                existingItem.quantity += 1
            }else{
                state.items.push({...action.payload, quantity: 1})
            }
            console.log("Item added", action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchOrders.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchOrders.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
          })
          .addCase(fetchOrders.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Failed to fetch orders';
          })
          .addCase(addToOrder.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(addToOrder.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
              existingItem.quantity = action.payload.quantity;
            } else {
              state.items.push(action.payload as OrderItem);
            }
          })
          .addCase(addToOrder.rejected, (state) => {
            state.status = 'failed';
          });
    },
  })


  export const {addItemToOrder} = orderSlice.actions
  export default orderSlice.reducer