import Nav from "./layout/nav";
import Hero from "./components/hero";

export default async function Home() {
  const graphqlEndpoint = 'https://api.hardcover.app/v1/graphql';
  const userId = 40712; // Replace with the actual user ID or fetch dynamically
  
  const query = `
    query {
      list_books(
        where: {
            user_books: {
                user_id: {_eq: 40712}
                status_id: {_eq: 1}
            }
        },
        distinct_on: book_id
        offset: 0
        limit: 5
      ) {
        book {
          id
          title
          cached_image
          cached_contributors
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

  return (
    <main className="font-sans">
      <Nav />
      <Hero currentReading={books} />
    </main>
  );
}
