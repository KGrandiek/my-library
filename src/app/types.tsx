export interface AuthorType {
    author: {
      id: number,
      slug: string,
      name: string,
    },
    contribution: string | null
}

export interface TagType {
    tag: string,
    tagSlug: string,
    category: string,
    categorySlug: string,
    spoilerRatio: number,
    count: number
}

export interface BookType {
    book: {
        id: string;
        title: string;
        cached_image: {
            url: string;
        };
        cached_contributors: AuthorType[];
        cached_tags?: any; // Adjust type based on actual structure
        pages?: number; // Optional, as not all books may have page count
        rating?: number; // Optional, as not all books may have a rating
        release_date?: string; // Optional, as not all books may have a release date
    };
    user_books?: {
        last_read_date?: string | undefined; // Optional, as not all books may have a last read date
        book_id?: string; // Optional, as not all books may have a book ID
    }[];
}