export interface CartItem {
    book_id: number;
    booknum: number;
}
  
export interface Cart {
    arrayOfBooks: CartItem[];
    totalItemNum: number;
}
  
