import { createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

interface Foods {
  id?: string
  name: string
  description: string
  rate: number
  total: number
  interest: number
  percent: number
  ingredient: string
  nurtrition: string
  createdAt?: string | null
  imageUrl: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface FoodsState {
  Foods: Foods[]
  loading: boolean
  error: string | null
}

const initialState: FoodsState = {
  Foods: [],
  loading: true,
  error: null,
}

// 🔄 Thunks
export const addFoods = createAsyncThunk<
  Foods,
  Foods,
  { rejectValue: string }
>('Foods/add', async (studentData, thunkAPI) => {
  try {
    const dataWithTimestamp = {
      ...studentData,
      createdAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, 'Foods'), dataWithTimestamp)
    return {
      ...studentData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

export const fetchFoods = createAsyncThunk<Foods[]>(
  'Foods/fetch',
  async () => {
    const snapshot = await getDocs(collection(db, 'Foods'))
    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Foods => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
        } as Foods
      }
    )
  }
)

export const deleteFoods = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('Foods/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'Foods', id))
    return id
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

export const updateFoods = createAsyncThunk<
  Foods,
  { id: string; data: Partial<Foods> },
  { rejectValue: string }
>('Foods/update', async ({ id, data }, thunkAPI) => {
  try {
    const docRef = doc(db, 'Foods', id)
    await updateDoc(docRef, data)
    return { id, ...data } as Foods
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

export const foodsSlice = createSlice({
  name: 'Foods',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true
      })
      .addCase(addFoods.fulfilled, (state, action) => {
        state.loading = false
        state.Foods.push(action.payload)
      })
      .addCase(addFoods.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Add Foods failed'
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.Foods = action.payload
        state.loading = false
      })
      .addCase(deleteFoods.fulfilled, (state, action) => {
        state.Foods = state.Foods.filter((s) => s.id !== action.payload)
      })
      .addCase(updateFoods.fulfilled, (state, action) => {
        const index = state.Foods.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.Foods[index] = { ...state.Foods[index], ...action.payload }
        }
      })
  },
})
export default foodsSlice.reducer


