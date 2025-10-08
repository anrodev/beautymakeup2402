export type OrderRefType = {

    id: number;
    date_paid: string;
    status: string;
}

export type lineItemsType ={
    id:number;
    product_id:number;
}

export type OrderType = {

    id:number,
    order_key:string,
    line_items:lineItemsType[]
}