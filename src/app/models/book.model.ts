export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    averageRating?: number;
    language?: string;
  };
}

export interface BooksResponse {
  items: Book[];
  totalItems: number;
}