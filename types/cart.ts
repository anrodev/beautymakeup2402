import { ProductType } from "./products"

export type ProductGiftCardType = {
  order_id?:number;
  order_item_id?: number;
  recipient: string;
  sender: string;
  balance: number;
  deliver_date?: string;
}


export type CartType = ProductType & {amount:number} & {gift_card:ProductGiftCardType|null};