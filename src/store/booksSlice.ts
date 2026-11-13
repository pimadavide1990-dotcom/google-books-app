import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BookItem, GoogleBooksResponse } from '../types/book';

interface BooksState {
  items: BookItem[];
  totalItems: number;
  query: string;
  currentPage: number;
  maxResults: number;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  totalItems: 0,
  query: 'react',
  currentPage: 1,
  maxResults: 10,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk<
  GoogleBooksResponse,
  { query: string; currentPage: number; maxResults: number },
  { rejectValue: string }
>('books/fetchBooks', async ({ query, currentPage, maxResults }, { rejectWithValue }) => {
  if (!query.trim()) {
    return { totalItems: 0, items: [] };
  }

  const startIndex = (currentPage - 1) * maxResults;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&startIndex=${startIndex}&maxResults=${maxResults}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Troppe richieste in poco tempo. Attendi un minuto prima di effettuare una nuova ricerca.');
      }
      throw new Error(`Errore HTTP: ${response.status}`);
    }
    const data: GoogleBooksResponse = await response.json();
    return data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Errore durante il recupero dei libri'
    );
  }
});

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setMaxResults(state, action: PayloadAction<number>) {
      state.maxResults = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Errore sconosciuto';
      });
  },
});

export const { setQuery, setCurrentPage, setMaxResults } = booksSlice.actions;
export default booksSlice.reducer;