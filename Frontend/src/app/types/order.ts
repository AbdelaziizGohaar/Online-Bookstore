export interface Order {
    order_id: number;
    user_id: number;
    books: {
        book_id: number;
        book_name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    createdAt: Date;
}