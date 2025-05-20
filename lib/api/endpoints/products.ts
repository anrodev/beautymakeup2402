import { API_URL, getAuthHeader } from "../config";

import { ApiErrorType, ProductType } from "../../../types";

export const fetchProducts = async (
  perPage: number,
  page: number,
  orderby: string = "date",
  order: string = "desc"
) => {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&orderby=${orderby}&order=${order}`,
    {
      headers: {
        Authorization: getAuthHeader(),
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
};
