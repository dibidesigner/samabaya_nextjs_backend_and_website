export interface ProductItem {
  _id: string;
  productCategory: string;
  productName: string;
  itemName: string;
  quantity: number;
  price: number;
  stock: number;
  loved: boolean;
  productUnit: string;
  imageBase641?: string;
}
