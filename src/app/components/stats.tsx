'use client';

import {useState} from 'react';
import Card from "../components/card";
import fictionImg from "../../../public/fiction.png";
import { BookType, TagType } from '../types';

export default function Stats({ books }: { books: any }) {
  const [timeframe, setTimeframe] = useState('All time');

  const filteredBooks = books.filter((book: BookType) => {
    const lastUserBook = book.user_books?.[book.user_books.length - 1];
    const lastReadDate = lastUserBook?.last_read_date ? new Date(lastUserBook.last_read_date) : null;
    const today = new Date();
    console.log('Book:', book);
    if (timeframe === 'Yearly') {
      return lastReadDate.getFullYear() === today.getFullYear();
    } else if (timeframe === 'Monthly') {
      return lastReadDate.getFullYear() === today.getFullYear() && lastReadDate.getMonth() === today.getMonth();
    }
    return true; // All time
  });
  console.log('Filtered Books:');

  const bookCount = filteredBooks.length;
  const pageCount = filteredBooks.reduce((total:number, book:BookType) => total + (book.book?.pages || 0), 0);
  const longestBook = filteredBooks.reduce((longest:BookType, book:BookType) => {
    if (!longest || (book.book?.pages || 0) > (longest.book?.pages || 0)) {
      return book;
    }
    return longest;
  });

  const shortestBook = filteredBooks.reduce((shortest:BookType, book:BookType) => {
    if (!shortest || book.book?.pages != null || (book.book?.pages || 0) < (shortest.book?.pages || 0)) {
      return book;
    }
    return shortest;
  });

  let genresArray:string[] = [];
  filteredBooks.forEach((book:BookType) => {
    if (book.book?.cached_tags?.Genre) {
      book.book?.cached_tags?.Genre.forEach((genre:TagType) => {
        if (!genresArray.includes(genre.tag)) {
          genresArray.push(genre.tag);
        }
      });
    }
  });

  const genresObject = countGenres(filteredBooks, genresArray);
  
  function countGenres(books: BookType[], genres: string[]) {
    const genreCounts: { [key: string]: number } = {};
    genres.forEach((genre) => {
      let count = 0;
      books.forEach((book:BookType) => {
        const tags = book.book?.cached_tags?.Genre || [];
        count += tags.filter((t:TagType) => t.tag === genre).length;
      });
      genreCounts[genre] = count;
    });

    return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
  }


    return (
    <div className="p-8 flex flex-col items-center">
        <h1 className="text-5xl text-center mb-6">
          Your
          <select value={timeframe} className="select select-ghost" onChange={e => setTimeframe(e.target.value)}>
            <option>All time</option>
            <option>Yearly</option>
            <option>Monthly</option>
          </select>
          stats
        </h1>
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Pages read</div>
            <div className="stat-value">{pageCount}</div>
            <div className="stat-desc">From January 1st to February 1st</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Books read</div>
            <div className="stat-value text-secondary">{bookCount}</div>
            <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Genres read</div>
            <div className="stat-value">{genresArray.length}</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>

        <div className="flex flex-row gap-5 mt-12 mb-8 ">
          <Card
            title={longestBook.book.title}
            imageUrl={longestBook.book.cached_image.url}
            description={`Longest book with ${longestBook.book.pages} pages.`}
          />
          <Card
            title={shortestBook.book.title}
            imageUrl={shortestBook.book.cached_image.url}
            description={`Shortest book with ${shortestBook.book.pages} pages.`}
          />
          <Card
            title={genresObject[0]?.tag || 'No Genre'}
            imageUrl={fictionImg.src}
            description={`Your favourite genre is ${genresObject[0]?.tag || 'unknown'} with ${genresObject[0]?.count || 0} books.`}
          />
        </div>
    </div>
  );
}
