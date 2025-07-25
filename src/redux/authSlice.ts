// store/authSlice.ts
import { doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { db } from '@/firebase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import auth from '@/firebase';

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  currentUser: SerializableUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

const serializeUser = (user: User): SerializableUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const signup = createAsyncThunk<
  SerializableUser,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('auth/signup', async ({ email, password, name }, thunkAPI) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      createdAt: new Date().toISOString(),
    });

    return serializeUser(user);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

export const login = createAsyncThunk<
  SerializableUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return serializeUser(res.user);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
  return null;
});

export const resetPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('auth/resetPassword', async ({ email }, thunkAPI) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

export const updateEmailThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('auth/updateEmail', async ({ email }, thunkAPI) => {
  try {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updateEmail(auth.currentUser, email);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

export const updatePasswordThunk = createAsyncThunk<
  void,
  { password: string },
  { rejectValue: string }
>('auth/updatePassword', async ({ password }, thunkAPI) => {
  try {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updatePassword(auth.currentUser, password);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

export const listenToAuthChanges = createAsyncThunk<SerializableUser | null>(
  'auth/listen',
  () =>
    new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user ? serializeUser(user) : null);
      });
    })
);

export const loginWithGoogle = createAsyncThunk<
  SerializableUser,
  void,
  { rejectValue: string }
>('auth/loginWithGoogle', async (_, thunkAPI) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return serializeUser(user);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Unknown error');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Signup failed';
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Google Sign-In failed';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload ?? 'Reset password failed';
      })
      .addCase(updateEmailThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Update email failed';
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Update password failed';
      })
      .addCase(listenToAuthChanges.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
