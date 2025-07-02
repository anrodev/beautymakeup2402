export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  price_html: string;
  stock_quantity: number;
  images: { src: string }[];
};