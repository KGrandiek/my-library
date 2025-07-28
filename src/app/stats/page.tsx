import Nav from "../components/nav";
import Card from "../components/card";
import fictionImg from "../../../public/fiction.png";
import { BookType, TagType } from '../types';

export default async function Home() {
  const graphqlEndpoint = 'https://api.hardcover.app/v1/graphql';
  const userId = 40712; // Replace with the actual user ID or fetch dynamically
  
  const query = `
    query {
      list_books(
        where: {
            user_books: {
                user_id: {_eq: 40712}
                status_id: {_eq: 3}
            }
        },
        distinct_on: book_id
        offset: 0
      ) {
        book {
          id
          title
          pages
          cached_contributors
          cached_image
          cached_tags
          rating
          release_date
        }
      }
    }
  `;

  const schemeQuery = `
  query {
  __type(name: "user_books") {
    fields {
      name
    }
  }
}
  `;

  const data = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': process.env.HARDCOVER_API_KEY || '',
    },
    body: JSON.stringify({
      query: query,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error fetching GraphQL data:', error);
  });

  // console.log('GraphQL Data:', data.data.__type);

  const books = data?.data?.list_books || [];
  const bookCount = books.length;
  const pageCount = books.reduce((total:number, book:BookType) => total + (book.book?.pages || 0), 0);
  const longestBook = books.reduce((longest:BookType | null, book:BookType) => {
    if (!longest || (book.book?.pages || 0) > (longest.book?.pages || 0)) {
      return book;
    }
    return longest;
  }, null);

  const shortestBook = books.reduce((shortest:BookType | null, book:BookType) => {
    if (!shortest || book.book?.pages != null || (book.book?.pages || 0) < (shortest.book?.pages || 0)) {
      return book;
    }
    return shortest;
  }, null);

  let genresArray:string[] = [];
  books.forEach((book:BookType) => {
    if (book.book?.cached_tags?.Genre) {
      book.book?.cached_tags?.Genre.forEach((genre:TagType) => {
        if (!genresArray.includes(genre.tag)) {
          genresArray.push(genre.tag);
        }
      });
    }
  });

  const genresObject = countGenres(books, genresArray);
  
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

  console.log('genresObject:', genresObject);


  return (
    <main className="font-sans">
      <Nav />
      <div className="p-8 flex flex-col items-center">
        <h1 className="text-5xl text-center mb-6">Your stats</h1>
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
    </main>
  );
}
