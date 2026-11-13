import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setQuery } from '../store/booksSlice';

export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.books.query);

  return (
    <div className="mb-6">
      <div className="relative flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-white">
        <span className="pl-4 text-gray-400">🔍</span>
        <input
          type="text"
          className="w-full py-3 px-3 outline-none text-gray-700 placeholder-gray-400"
          placeholder="Cerca libri per titolo, autore, argomento..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
      </div>
    </div>
  );
};