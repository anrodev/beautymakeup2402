import { API_URL, getWooAuthHeader } from "../config";

import {
  ApiErrorType,
  ProductType,
  ProductVariationType,
} from "../../../types";

export const fetchProducts = async (
  perPage: number,
  page: number,
  category: number | null = null,
  search: string,
  orderby: string = "date",
  order: string = "desc"
) => {
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      orderby,
      order,
    });

    if (category !== null) {
      params.append("category", String(category));
    }

    if (search) {
      params.append("search", search);
    }

    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products?${params.toString()}`,
      {
        headers: {
          Authorization: getWooAuthHeader(),
        },
      }
    );

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    const total = Number(res.headers.get("X-WP-Total") ?? 0);

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);

    const data: ProductType[] = await res.json();

    const products = data.map(({ stock_quantity, ...rest }) => ({
      ...rest,
      stock_quantity: stock_quantity ?? 0,
    }));

    return { records: { products, total, totalPages } };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/products/${id}`, {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    const data: ProductType = await res.json();

    const product = {
      ...data,
      stock_quantity: data.stock_quantity ?? 0,
    };

    return product;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchProductVariations = async (id: number):Promise<ProductVariationType[]> => {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products/${id}/variations`,
      {
        headers: {
          Authorization: getWooAuthHeader(),
        },
      }
    );

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return await res.json();

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
