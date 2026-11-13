import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import type { BookItem } from '../types/book';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const bookFromStore = useAppSelector((state) =>
    state.books.items.find((item) => item.id === id)
  );

  const [fetchedBook, setFetchedBook] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState<boolean>(!bookFromStore);
  const [error, setError] = useState<string | null>(null);

  const book = bookFromStore || fetchedBook;

  useEffect(() => {
    let isMounted = true;

    if (!bookFromStore && id) {
      setLoading(true);
      fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Impossibile trovare il libro richiesto');
          return res.json();
        })
        .then((data: BookItem) => {
          if (isMounted) {
            setFetchedBook(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, bookFromStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">{error || 'Libro non trovato'}</div>
        <button className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:opacity-90" onClick={() => navigate('/')}>
          Torna alla ricerca
        </button>
      </div>
    );
  }

  const {
    title,
    authors,
    publisher,
    publishedDate,
    description,
    pageCount,
    categories,
    imageLinks,
    infoLink,
  } = book.volumeInfo;

  const placeholderUrl = 'https://placehold.co/400x600/FF5039/FFF?text=Book+Cover';
  const coverImage = imageLinks?.thumbnail || imageLinks?.smallThumbnail || placeholderUrl;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Torna ai risultati
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6">
          <img
            src={coverImage}
            alt={title}
            className="max-h-[400px] object-contain shadow-md rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderUrl;
            }}
          />
        </div>

        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            {categories && (
              <span className="inline-block bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full mb-3">
                {categories[0]}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <h2 className="text-lg text-gray-500 mb-6">
              {authors ? authors.join(', ') : 'Autore sconosciuto'}
            </h2>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 text-sm text-gray-600 mb-6">
              <div>
                <span className="block font-semibold text-gray-800">Editore</span>
                {publisher || 'N/D'}
              </div>
              <div>
                <span className="block font-semibold text-gray-800">Pubblicazione</span>
                {publishedDate || 'N/D'}
              </div>
              <div>
                <span className="block font-semibold text-gray-800">Pagine</span>
                {pageCount ? `${pageCount} pag.` : 'N/D'}
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2">Descrizione</h3>
            <div
              className="text-gray-600 text-sm leading-relaxed mb-8"
              dangerouslySetInnerHTML={{
                __html: description || 'Nessuna descrizione disponibile.',
              }}
            />
          </div>

          <div>
            <a
              href={infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand text-white px-8 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition-opacity"
            >
              Vedi su Google Books &nearr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};