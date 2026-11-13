import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchBooks } from '../store/booksSlice';
import { SearchBar } from '../components/SearchBar';
import { BookCard } from '../components/BookCard';
import { Pagination } from '../components/Pagination';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, query, currentPage, maxResults, loading, error } =
    useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ query, currentPage, maxResults }));
  }, [dispatch, query, currentPage, maxResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Google Books Explorer</h1>
        <p className="text-gray-500">Cerca tra milioni di libri in tempo reale con Tailwind v4</p>
      </header>

      <SearchBar />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
          <p className="text-gray-500">Caricamento libri in corso...</p>
        </div>
      ) : (
        <>
          {!loading && query.trim() !== '' && items.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <h3 className="text-xl font-semibold mb-1">Nessun libro trovato per "{query}"</h3>
              <p>Prova a cercare con un altro termine.</p>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="text-sm text-gray-500 mb-4">
                Trovati circa <strong className="text-gray-700">{totalItems.toLocaleString()}</strong> risultati
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              <Pagination />
            </>
          )}
        </>
      )}
    </div>
  );
};