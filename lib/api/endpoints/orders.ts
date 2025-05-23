import { OrderType } from "@/app/generateOrder";
import { API_URL, getWooAuthHeader } from "../config";
import { ApiErrorType, CartType } from "@/types";

export const fetchGenerateOrder = async (
  order: OrderType,
  products: CartType[]
) => {
  const { email, phone, ...shipping } = order;

  const productItems = products.map(({ id, amount }) => ({
    product_id: id,
    quantity: amount,
  }));

  const res = await fetch(`${API_URL}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      Authorization: getWooAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        set_paid: false,
        billing: {
          ...shipping,
          email,
          phone,
        },
        shipping: shipping,
        line_items: productItems,
      }),
  });

  if (!res.ok) {
    const error: ApiErrorType = await res.json();
    throw new Error(error.message || "Unknown error");
  }

  const data:{id:number,order_key:string} = await res.json();

  console.log(data);

  const orderId = data.id;
  const orderKey = data.order_key;
  const paymentUrl = `${API_URL}/pago/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;
  return paymentUrl;

};


export const fetchCustomer = async (userId:number) => {

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

  const customer:{billing:OrderType} = await customerRes.json();

  return customer;
};

