import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/firebase'

export interface Teacher {
  id?: string
  name: string
  email: string
  phone: string
  job: string
  about: string
  education: string
  experites: string
  city: string
  createdAt: string | null
  imageUrl?: string
}

interface TeacherState {
  teachers: Teacher[]
  loading: boolean
  error: string | null
  search: string | null
}

const initialState: TeacherState = {
  teachers: [],
  loading: true,
  error: null,
  search: null
}

// ➕ Add Teacher
export const addteachers = createAsyncThunk<
  Teacher,
  Teacher,
  { rejectValue: string }
>('teachers/add', async (teacherData, thunkAPI) => {
  try {
    await addDoc(collection(db, 'teachers'), {
      ...teacherData,
      createdAt: serverTimestamp()
    })
    return { ...teacherData, id: crypto.randomUUID() }
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

// 📥 Fetch All Teachers
export const fetchteachers = createAsyncThunk<Teacher[]>(
  'teachers/fetch',
  async () => {
    const snapshot = await getDocs(collection(db, 'teachers'))
    return snapshot.docs.map(
      (docSnap: QueryDocumentSnapshot<DocumentData>): Teacher => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null
        } as Teacher
      }
    )
  }
)


// 🗑️ Delete Teacher
export const deleteteacher = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('teachers/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'teachers', id))
    return id
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

// ✏️ Update Teacher
export const updateteacher = createAsyncThunk<
  Teacher,
  { id: string; data: Partial<Teacher> },
  { rejectValue: string }
>('teachers/update', async ({ id, data }, thunkAPI) => {
  try {
    const docRef = doc(db, 'teachers', id)
    await updateDoc(docRef, data)
    return { id, ...data } as Teacher
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

const teacherslice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchteachers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchteachers.fulfilled, (state, action) => {
        state.teachers = action.payload
        state.loading = false
      })
      .addCase(fetchteachers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Fetch teachers failed'
      })
      .addCase(addteachers.fulfilled, (state, action) => {
        state.loading = false
        state.teachers.push(action.payload)
      })
      .addCase(addteachers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Add teachers failed'
      })
      .addCase(deleteteacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteteacher.rejected, (state, action) => {
        state.error = action.payload || 'Delete failed'
      })
      .addCase(updateteacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(
          (t) => t.id === action.payload.id
        )
        if (index !== -1) {
          state.teachers[index] = {
            ...state.teachers[index],
            ...action.payload
          }
        }
      })
      .addCase(updateteacher.rejected, (state, action) => {
        state.error = action.payload || 'Update failed'
      })
  }
})

export default teacherslice.reducer
