import { Product } from '../common/product';
export interface GetResponse {
    _embedded: {
        products: Product[];
      },
      page : {
           size: number,
           totalElement: number,
           totalPages: number,
           number: number
      }
}
