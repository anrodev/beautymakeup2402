
export type ProductVariationType = {
  id:number;
  price:number;
  regular_price: number;
  sale_price: number;
  stock_quantity: number;
  image: { 
    src: string 
  };
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
}


export type ProductCategoryType = {
  id:number;
  name:string;
  slug:string;
}



export type ProductType = {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  regular_price: number;
  sale_price: number;
  price_html: string;
  stock_quantity: number;
  categories: ProductCategoryType[];
  images: { 
    src: string 
  }[];
  attributes: {
    id: number;
    name: string;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
};
