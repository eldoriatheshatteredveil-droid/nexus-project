interface Game {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    genre: string[];
    releaseDate: string;
    isAvailable: boolean;
}

interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

interface CartItem {
    gameId: string;
    quantity: number;
}

interface Cart {
    items: CartItem[];
    totalPrice: number;
}

interface PaymentDetails {
    method: 'creditCard' | 'crypto';
    amount: number;
    currency: string;
}

interface ApiResponse<T> {
    data: T;
    error?: string;
}

export type { Game, User, CartItem, Cart, PaymentDetails, ApiResponse };