import Nav from "../layout/nav";

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
          book_category_id
          cached_contributors
          book_status_id
          cached_tags
          rating
          release_date
        }
      }
    }
  `;

  const schemeQuery = `
  query {
  __type(name: "books") {
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
  const pageCount = books.reduce((total, book) => total + (book.book?.pages || 0), 0);
  let genresArray:string[] = [];
  books.forEach(book => {
    if (book.book?.cached_tags?.Genre) {
      book.book?.cached_tags?.Genre.forEach(genre => {
        if (!genresArray.includes(genre.tag)) {
          genresArray.push(genre.tag);
        }
      });
    }
  });
  console.log('genere:', genresArray);

  return (
    <main className="font-sans">
      <Nav />
      <div className="p-8 flex flex-col items-center">
        <h1 className="text-5xl text-center">Your stats</h1>
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
      </div>
    </main>
  );
}
