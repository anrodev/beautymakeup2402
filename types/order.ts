export type OrderRefType = {

    id: number;
    date_paid: string;
    status: string;
}

export type lineItemsType ={
    id:number;
    product_id:number;
    name:string;
    quantity:number;
    total:string;
    image:{src:string}|null;
}

export type OrderType = {
    id:number;
    order_key:string;
    number:string;
    payment_method:string;
    shipping_total:string;
    currency_symbol:string;
    total:string;
    date_created:string;
    date_paid:string;
    line_items:lineItemsType[];
    status:string;
}