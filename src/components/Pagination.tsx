import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setCurrentPage, setMaxResults } from '../store/booksSlice';

export const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalItems, maxResults } = useAppSelector((state) => state.books);
  const totalPages = Math.ceil(totalItems / maxResults) || 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center my-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="limitSelect" className="text-sm text-gray-600 font-medium">
          Risultati per pagina:
        </label>
        <select
          id="limitSelect"
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white outline-none"
          value={maxResults}
          onChange={(e) => dispatch(setMaxResults(Number(e.target.value)))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => currentPage > 1 && dispatch(setCurrentPage(currentPage - 1))}
          disabled={currentPage === 1}
        >
          Precedente
        </button>

        <span className="text-sm text-gray-600 font-medium">
          Pagina {currentPage} di {totalPages}
        </span>

        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => currentPage < totalPages && dispatch(setCurrentPage(currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Successiva
        </button>
      </div>
    </div>
  );
};