export type GiftCardType = {
  code:string;
  balance:number;
  is_active:"off"|"on"
}


export type GiftCardOrderType = {
  code:string;
  amount:number;
}