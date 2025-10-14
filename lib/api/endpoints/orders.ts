import { OrderSchemaType } from "@/app/generateOrder";
import { API_URL, getWooAuthHeader } from "../config";
import {
  ApiErrorType,
  CartType,
  CouponType,
  GiftCardOrderType,
  GiftCardType,
  OrderRefType,
  OrderType,
  ProductGiftCardType,
} from "@/types";

export const fetchGenerateOrder = async (
  order: OrderSchemaType,
  products: CartType[],
  couponCode: string | null,
  giftCards: GiftCardOrderType[]
) => {
  try {
    const { email, phone, ...shipping } = order;

    const productItems = products.map(({ id, amount }) => ({
      product_id: id,
      quantity: amount,
    }));

    const body: any = {
      payment_method: "bacs",
      payment_method_title: "Transferencia bancaria",
      set_paid: false,
      billing: {
        ...shipping,
        email,
        phone,
      },
      shipping: shipping,
      line_items: productItems,
    };

    if (couponCode) {
      body.coupon_lines = [
        {
          code: couponCode,
        },
      ];
    }

    if (giftCards.length > 0) {
      body.gift_cards = giftCards;
    }

    const res = await fetch(`${API_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        Authorization: getWooAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    const data: OrderType = await res.json();

    const orderId = data.id;
    const orderKey = data.order_key;
    const lineItems = data.line_items;
    const paymentUrl = `${API_URL}/pago/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

    return { orderId, orderKey, lineItems, paymentUrl };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchGiftCard = async (code: string): Promise<GiftCardType[]> => {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/gift-cards?code=${code}`,
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

export const fetchAddGiftCards = async (
  giftCardData: ProductGiftCardType[]
) => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/gift-cards/batch`, {
      method: "POST",
      headers: {
        Authorization: getWooAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ create: giftCardData }),
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return res.ok;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchCoupon = async (coupon: string): Promise<CouponType[]> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/coupons?code=${coupon}`, {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    });

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

export const fetchOrders = async (
  userId: number,
  perPage: number,
  page: number,
  dateFrom: string,
  dateTo: string,
  orderby: string = "date",
  order: string = "desc"
) => {
  try {
    const params = new URLSearchParams({
      customer: String(userId),
      per_page: String(perPage),
      page: String(page),
      orderby,
      order,
    });

    if (dateFrom) {
      params.append("after", dateFrom + "T00:00:00Z");
    }

    if (dateTo) {
      params.append("before", dateTo + "T23:59:59Z");
    }

    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/orders?${params.toString()}`,
      {
        headers: { Authorization: getWooAuthHeader() },
      }
    );

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    const total = Number(res.headers.get("X-WP-Total") ?? 0);

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);

    const orders: OrderType[] = await res.json();

    return { records: { orders, total, totalPages } };
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fecthOrder = async (order: number):Promise<OrderRefType> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/orders/${order}`, {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return await res.json();

  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchPutOrder = async (orderId: number, customerId: number) => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/orders/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: getWooAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: customerId }),
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return res.ok;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
