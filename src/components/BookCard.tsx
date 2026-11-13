import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookItem } from '../types/book';

interface BookCardProps {
  book: BookItem;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { title, authors, description, imageLinks } = book.volumeInfo;

  const placeholderUrl = "https://placehold.co/400x600/FF5039/FFF?text=Book+Cover";
  const coverImage = imageLinks?.thumbnail || imageLinks?.smallThumbnail || placeholderUrl;

  return (
    <div 
      onClick={() => navigate(`/book/${book.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={coverImage}
          alt={title}
          className="h-full object-contain shadow"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderUrl;
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg truncate mb-1" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {authors ? authors.join(', ') : 'Autore sconosciuto'}
        </p>
        <p className="text-xs text-gray-600 line-clamp-2 mt-auto">
          {description || 'Nessuna descrizione disponibile.'}
        </p>
      </div>
    </div>
  );
};