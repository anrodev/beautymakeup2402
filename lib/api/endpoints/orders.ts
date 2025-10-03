import { OrderType } from "@/app/generateOrder";
import { API_URL, getWooAuthHeader } from "../config";
import { ApiErrorType, CartType, CouponType, OrderRefType } from "@/types";

export const fetchGenerateOrder = async (
  order: OrderType,
  products: CartType[],
  couponCode: string | null
) => {
  const { email, phone, ...shipping } = order;

  const productItems = products.map(({ id, amount }) => ({
    product_id: id,
    quantity: amount,
  }));

  const body: any = {
    payment_method: "cod",
    payment_method_title: "Pedido pendiente (App Móvil)",
    set_paid: false,
    billing: {
      ...shipping,
      email,
      phone
    },
    shipping: shipping,
    line_items: productItems
  };

  if (couponCode) {
    body.coupon_lines = [
      {
        code: couponCode
      }
    ];
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

  const data: { id: number; order_key: string } = await res.json();

  const orderId = data.id;
  const orderKey = data.order_key;
  const paymentUrl = `${API_URL}/pago/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

  return {orderId,orderKey,paymentUrl};
};

export const fetchCustomer = async (userId: number) => {
  const customerRes = await fetch(
    `${API_URL}/wp-json/wc/v3/customers/${userId}`,
    {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    }
  );

  if (!customerRes.ok) {
    const error: ApiErrorType = await customerRes.json();
    throw new Error(error.message || "Unknown error");
  }

  const customer: { billing: OrderType } = await customerRes.json();

  return customer;
};

export const fetchCoupon = async (coupon: string) => {
  const couponsRes = await fetch(
    `${API_URL}/wp-json/wc/v3/coupons?code=${coupon}`,
    {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    }
  );

  if (!couponsRes.ok) {
    const error: ApiErrorType = await couponsRes.json();
    throw new Error(error.message || "Unknown error");
  }

  const coupons: CouponType[] = await couponsRes.json();

  return coupons;
};


export const fecthOrder = async(order:number) =>{
  const orderRes = await fetch(
    `${API_URL}/wp-json/wc/v3/orders/${order}`,
    {
      headers: {
        Authorization: getWooAuthHeader()
      },
    }
  );

  if (!orderRes.ok) {
    const error: ApiErrorType = await orderRes.json();
    throw new Error(error.message || "Unknown error");
  }

  const orders: OrderRefType = await orderRes.json();

  return orders;
}
