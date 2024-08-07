import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
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
    totalQuantity: number,
    totalSum: number,

  }

  const initialState: OrderState = {
    items: [],
    status: 'idle',
    error: null,
    totalQuantity: 0,
    totalSum: 0,
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
  
  export const removeOrder = createAsyncThunk(
    'order/removeOrder',
    async (item: Omit<OrderItem, 'id'>) => {
      try {
        const orderCollectionRef = collection(db, 'orders');
        const q = query(orderCollectionRef, where('dishname', '==', item.dishname));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Varan finns redan, uppdatera kvantiteten -1
          const existingDoc = querySnapshot.docs[0];
          const existingData = existingDoc.data() as OrderItem;
          const newQuantity = existingData.quantity - 1;
          const docRef = doc(db, 'orders', existingDoc.id);
          
          // Kontrollera om kvantiteten är mindre än 1
          if (newQuantity <= 0) {
            await deleteDoc(docRef);
            return { ...existingData, quantity: 0, id: existingDoc.id };
          } else {
            await updateDoc(docRef, { quantity: newQuantity });
            return { ...existingData, quantity: newQuantity, id: existingDoc.id };
          }
        }
      } catch (error) {
        console.error('Error adding to firestore', error);
        throw error;
      }
    }
  );

  export const deleteOrderFirebase = createAsyncThunk(
    'order/deleteOrderFirebase',
    async (itemsToDelete: OrderItem[], { rejectWithValue }) => {
      try {
        const orderCollectionRef = collection(db, 'orders');
        const deletedItems: OrderItem[] = [];
  
        // Loop through each item to delete
        for (const item of itemsToDelete) {
          const q = query(orderCollectionRef, where('dishname', '==', item.dishname));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            const docRef = doc(db, 'orders', existingDoc.id);
            
            // Delete the document
            await deleteDoc(docRef);
            deletedItems.push({ ...item, id: existingDoc.id });
          }
        }
  
        return deletedItems;
      } catch (error) {
        console.error('Error deleting orders from firestore', error);
        return rejectWithValue('Failed to delete orders');
      }
    }
  );




  const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
      addItemToOrder: (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
        // Recalculate totalQuantity and totalSum
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalSum = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      removeItemFromOrder: (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            state.items = state.items.filter(item => item.id !== action.payload.id);
          }
          // Recalculate totalQuantity and totalSum
          state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
          state.totalSum = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
      },
      deleteOrder: (state, action: PayloadAction<OrderItem[]>) => {
        console.log("SLICE DELETE ORDER")
        state.items = state.items.filter(item => !action.payload.some(d => d.id === item.id));
        console.log("SLICE ITEMS", state.items)
        state.totalQuantity = 0
        state.totalSum = 0
      }
    },
    extraReducers: (builder) => {
      builder

      /* FETCH  ORDERS */
        .addCase(fetchOrders.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
          state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
          state.totalSum = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Failed to fetch orders';
        })

        /* ADD TO ORDER */

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
          // Recalculate totalQuantity and totalSum
          state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
          state.totalSum = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        })
        .addCase(addToOrder.rejected, (state) => {
          state.status = 'failed';
        })

        /* REMOVE ORDER */

        .addCase(removeOrder.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(removeOrder.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const payload = action.payload;
          if (payload) {
            const existingItem = state.items.find(item => item.id === payload.id);
            if (existingItem) {
              if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
              } else {
                state.items = state.items.filter(item => item.id !== payload.id);
              }
              // Recalculate totalQuantity and totalSum
              state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
              state.totalSum = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
          }
        })
        .addCase(removeOrder.rejected, (state) => {
          state.status = 'failed';
        })

        /* DELETE FULL ORDER */

        .addCase(deleteOrderFirebase.pending, (state) => {
          console.log("Delete order pending");
          state.status = 'loading';
        })
        .addCase(deleteOrderFirebase.fulfilled, (state, action) => {
          console.log("Delete order fulfilled");
          state.status = 'succeeded';
          state.items = state.items.filter(item => !action.payload.some(d => d.id === item.id));
          state.totalQuantity = 0
          state.totalSum = 0
        })
        .addCase(deleteOrderFirebase.rejected, (state) => {
          console.log("Delete order rejected");
          state.status = 'failed';
        });
    }
  });


  export const {addItemToOrder, removeItemFromOrder, deleteOrder} = orderSlice.actions
  export default orderSlice.reducer