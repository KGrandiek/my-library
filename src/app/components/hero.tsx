import { AuthorType, BookType } from '../types';

interface HeroProps {
    currentReading: BookType[];
}

function AuthorString(authors: AuthorType[]) {
    return (
        <span>
            {authors.map((author, index) =>
                author.contribution === null && (
                    <span key={author.author.id}>
                        {index > 0 ? ', ' : ''}
                        {author.author.name}
                    </span>
                )
            )}
        </span>
    );
}

export default function Hero({currentReading}: HeroProps) {
  return (
    <div
        className="hero min-h-screen"
        style={{
            backgroundImage:
            "url(/day-library.jpg)",
        }}
        >
        <div className="hero-overlay" style={{backgroundColor: 'color-mix(in oklab, var(--color-neutral) 25%, transparent)'}}></div>
        <div className="hero-content text-neutral-content">
            <div className="max-w-md">
                <h1 className="mb-8 text-5xl font-bold text-center">Welcome to The Library</h1>
                <div className="glass3d rounded-lg p-6 mb-4">
                    <h2 className="text-2xl mb-6 font-bold">Currently reading</h2>
                    {currentReading.length > 0 && (
                        currentReading.map(book => {
                            return (
                                <div key={book.book.id} className="flex gap-4 mb-4">
                                    <img
                                        src={book.book.cached_image.url}
                                        alt={book.book.title}
                                        className="w-30 h-44 mb-4 rounded-lg shadow-lg"
                                    />
                                    <div>
                                        <h3 className="text-xl mb-2">{book.book.title}</h3>
                                        <p className="text-lg">by {AuthorString(book.book.cached_contributors)}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}