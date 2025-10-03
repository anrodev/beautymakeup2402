export type CouponType = {
  id: number;
  code: string;
  amount:number;
  description:string;
  status:string;
  discount_type:string;
  date_expires: string | null;
  usage_count: number;
  used_by: string[];
};