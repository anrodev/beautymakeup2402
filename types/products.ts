export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: { src: string }[];
};