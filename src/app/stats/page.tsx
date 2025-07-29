import Nav from "../components/nav";
import Stats from "../components/stats";

export default async function StatsPage() {
  const graphqlEndpoint = 'https://api.hardcover.app/v1/graphql';
  const userId = 40712;
  
  const query = `
    query {
      list_books(
        where: {
            user_books: {
                user_id: {_eq: ${userId}}
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
        user_books {
          last_read_date
          book_id
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
  // return

  const books = data?.data?.list_books || [];

  return (
    <main className="font-sans">
      <Nav />
      <Stats books={books}/>
    </main>
  );
}
