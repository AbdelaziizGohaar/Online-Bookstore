export interface Order {
    order_id: number;
    user_id: number;
    books: {
        book_id: number;
        book_name: string;
        quantity: number;
        price: number;
        image: string; // Ensure this property exists
    }[];
    totalPrice: number;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    createdAt: Date;
}