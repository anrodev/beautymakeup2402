import { ProductType } from "./products"

export type CartType = ProductType & {amount:number};