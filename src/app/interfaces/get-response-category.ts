import { ProductCategory } from "../common/product-category";

export interface GetResponseCategory {
    _embedded: {
        productCategory: ProductCategory[];
      }
}
