import { configureStore } from '@reduxjs/toolkit'
import menuReducer from '../slices/menuSlice';
/* import orderReducer from '../slices/orderSlice'; */
import orderReducer from '../slices/orderSlice'

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        order: orderReducer,
    }
})

// Defines the RootState type based on the store's state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
