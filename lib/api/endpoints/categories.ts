import { API_URL, getWooAuthHeader } from "../config";
import { ApiErrorType, CategoryType } from "@/types";


export const fetchCategories = async (
  perPage: number,
  page: number,
  order: string = "desc"
) => {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${page}&parent=0&order=${order}`,
    {
      headers: {
        Authorization: getWooAuthHeader()
      },
    }
  );

  if (!res.ok) {
    const error: ApiErrorType = await res.json();
    throw new Error(error.message || "Unknown error");
  }

  const total = Number(res.headers.get("X-WP-Total") ?? 0);

  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);

  const categories: CategoryType[] = await res.json();

  return {records:{categories,total,totalPages}};
};
