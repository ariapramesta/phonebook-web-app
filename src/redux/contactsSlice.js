import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { read, create, update, remove } from '../api/contactApi';

// Async thunks for CRUD operations
export const getContacts = createAsyncThunk('contacts/getContacts', async () => {
  const response = await read();
  return response.data;
});

export const createContact = createAsyncThunk('contacts/createContact', async (contact) => {
  const response = await create(contact);
  return response.data;
});

export const editContact = createAsyncThunk('contacts/editContact', async ({ id, contact }) => {
  const response = await update(id, contact);
  return response.data;
});

export const removeContact = createAsyncThunk('contacts/removeContact', async (id) => {
  await remove(id);
  return id;
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.phonebooks;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })

      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editContact.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default contactsSlice.reducer;
