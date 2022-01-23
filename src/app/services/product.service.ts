import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import {GetResponse} from '../interfaces/get-response'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { GetResponseCategory } from '../interfaces/get-response-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
   
 
  private baseUrl='http://localhost:8080/api/products';
  private categoryUrl='http://localhost:8080/api/product-category';

  constructor(private httpClient:HttpClient) { }


  getProductList(theCategoryId:number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }
  getProductListPaginate(page:number, size:number, theCategoryId:number): Observable<GetResponse> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`+`&page=${page}&size=${size}`;

    return this.httpClient.get<GetResponse>(searchUrl);
  }
  getProductCategories():Observable<ProductCategory[]> {
   
    return this.getProductCategory();

  }
  

  searchProducts(keyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }
  getSearchProductPaginate(page:number, size:number, keyword:string): Observable<GetResponse> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`+`&page=${page}&size=${size}`;

    return this.httpClient.get<GetResponse>(searchUrl);
  }
  getProduct(productId: number):Observable<Product> {
    const productUrl=`${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }
 

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  private getProductCategory(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

