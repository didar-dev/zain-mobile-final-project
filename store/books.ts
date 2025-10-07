import { create } from "zustand";

export const useBooks = create((set) => ({
  // books: [],
  recent_books: [],
  recent_books_loading: false,
  // setBooks: (books: any) => set({ books }),
  setRecentBooks: (recent_books: any) => set({ recent_books }),
  setRecentBooksLoading: (recent_books_loading: boolean) =>
    set({ recent_books_loading }),
  edit_book: null,
  setEditBook: (edit_book: any) => set({ edit_book }),
}));
