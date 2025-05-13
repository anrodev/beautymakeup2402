import { encode as b64encode } from 'base-64';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getAuthHeader() {
  const credentials = `${process.env.EXPO_PUBLIC_CONSUMER_KEY}:${process.env.EXPO_PUBLIC_CONSUMER_SECRET}`;
  const encoded = b64encode(credentials);
  return `Basic ${encoded}`;
}

export const fetchProducts= async(perPage:number,page:number,orderby:string='date',order:string='desc')=> {
 
  console.log(`${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&orderby=${orderby}&order=${order}`);
 
  const res = await fetch(`${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&orderby=${orderby}&order=${order}`, {
    headers: {
      'Authorization': getAuthHeader()
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "unknown error");
  }

  return data;
}

export const fetchCategories= async(perPage:number,page:number,order:string='desc')=> {
  const res = await fetch(`${API_URL}/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${page}&parent=0&order=${order}`, {
    headers: {
      'Authorization': getAuthHeader()
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "unknown error");
  }

  return data;
}