import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  query,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/firebase'

export interface Student {
  id?: string
  name: string
  email: string
  phone: string
  class: string
  grade: string
  price: number
  date: string
  parentName: string
  city: string
  feeStatus: string
  createdAt?: string | null
  imageUrl: string
}

interface StudentState {
  students: Student[]
  recentStudents: Student[]
  loading: boolean
  error: string | null
}

const initialState: StudentState = {
  students: [],
  recentStudents: [],
  loading: true,
  error: null,
}

// 🔄 Add student
export const addStudent = createAsyncThunk<
  Student,
  Student,
  { rejectValue: string }
>('students/add', async (studentData, thunkAPI) => {
  try {
    const nowISO = new Date().toISOString()
    await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: serverTimestamp()
    })
    return { ...studentData, id: crypto.randomUUID(), createdAt: nowISO }
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

// 🔄 Fetch all students
export const fetchStudents = createAsyncThunk<Student[]>(
  'students/fetch',
  async () => {
    const snapshot = await getDocs(collection(db, 'students'))
    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Student => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null
        } as Student
      }
    )
  }
)

// 🔄 Fetch recent students
export const fetchRecentStudents = createAsyncThunk<Student[]>(
  'students/fetchRecent',
  async () => {
    const q = query(
      collection(db, 'students'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Student => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null
        } as Student
      }
    )
  }
)

// 🔄 Delete student
export const deleteStudent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('students/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'students', id))
    return id
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

// 🔄 Update student
export const updateStudent = createAsyncThunk<
  Student,
  { id: string; data: Partial<Student> },
  { rejectValue: string }
>('students/update', async ({ id, data }, thunkAPI) => {
  try {
    const docRef = doc(db, 'students', id)
    await updateDoc(docRef, data)
    return { id, ...data } as Student
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return thunkAPI.rejectWithValue('Unknown error')
  }
})

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRecentStudents.fulfilled, (state, action) => {
        state.recentStudents = action.payload
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false
        state.students.push(action.payload)
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Add student failed'
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload
        state.loading = false
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.id !== action.payload)
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (s) => s.id === action.payload.id
        )
        if (index !== -1) {
          state.students[index] = {
            ...state.students[index],
            ...action.payload
          }
        }
      })
  }
})

export default studentSlice.reducer
