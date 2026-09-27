export interface Product {
  _id: string;
  productName: string;     
  price: number;
  imageBase641?: string;     
}

export interface CartProduct {
  _id: string;
  product: Product;
  quantity: number;
  prouctCategory:string
}

export interface Cart {
  _id: string;
  products: CartProduct[];
}
