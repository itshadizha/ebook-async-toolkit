import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  isLoading: false,
};

export const getEbookThunk = createAsyncThunk(
  "eBook/getBooks",
  async (_, thunkApi) => {
    try {
      const response = await fetch(
        "https://ebook-fe56c-default-rtdb.firebaseio.com/eBook.json"
      );
      const eBook = await response.json();

      const transformedBooks = [];

      for (const key in eBook) {
        transformedBooks.push({
          id: key,
          title: eBook[key].title,
          author: eBook[key].author,
          isFavorite: eBook[key].isFavorite,
        });
      }

      return transformedBooks;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addBookRequestThunk = createAsyncThunk(
  "eBook/postBook",
  async (newBook, thunkApi) => {
    try {
      await fetch(
        "https://ebook-fe56c-default-rtdb.firebaseio.com/eBook.json",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newBook),
        }
      );
      thunkApi.dispatch(getEbookThunk());
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteBookThunk = createAsyncThunk(
  "eBook/deleteBook",
  async (bookId, thunkApi) => {
    try {
      await fetch(
        `https://ebook-fe56c-default-rtdb.firebaseio.com/eBook/${bookId}.json`,
        {
          method: "DELETE",
        }
      );
      thunkApi.dispatch(getEbookThunk());
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const toggleFavoriteBookThunk = createAsyncThunk(
  "eBook/toggleFavorite",
  async (requestBody, thunkApi) => {
    try {
      await fetch(
        `https://ebook-fe56c-default-rtdb.firebaseio.com/eBook/${requestBody.id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(requestBody.body),
        }
      );
      thunkApi.dispatch(getEbookThunk());
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const bookSlice = createSlice({
  name: "eBook",
  initialState: initialState,

  extraReducers: (builder) => {
    builder.addCase(getEbookThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEbookThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.books = action.payload;
    });
    builder.addCase(getEbookThunk.rejected, (state) => {
      state.isLoading = false;
      console.log("Error fetching eBooks");
    });

    builder.addCase(addBookRequestThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addBookRequestThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addBookRequestThunk.rejected, (state) => {
      state.isLoading = false;
      console.log("Error adding book");
    });

    builder.addCase(deleteBookThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteBookThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteBookThunk.rejected, (state) => {
      state.isLoading = false;
      console.log("Error deleting book");
    });
  },
});

export const selectBooks = (state) => state.ebook.books;
export default bookSlice.reducer;
