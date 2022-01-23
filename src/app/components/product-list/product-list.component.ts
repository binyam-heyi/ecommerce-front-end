import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword=null;

  constructor(private productService: ProductService,private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    if(this.previousKeyword!=theKeyword){
      this.thePageNumber=1
    }
    this.previousKeyword=theKeyword;
    
   /*  this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    ) */
    this.productService.getSearchProductPaginate(this.thePageNumber -1, this.thePageSize,theKeyword).subscribe (
      this.processResult()
    )
  }

  handleListProducts() {

   
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
     
      this.currentCategoryId = 1;
    }

   
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  updatePageSize(pagesSize:number){
    this.thePageSize=pagesSize;
    this.thePageNumber=1;
    this.listProducts();
  }
  addToCart(product:Product){
    console.log(`Adding to Cart :${product.name},${product.unitPrice}`)
    const cartItem= new CartItem(product)
    this.cartService.addToCart(cartItem);
  }
}