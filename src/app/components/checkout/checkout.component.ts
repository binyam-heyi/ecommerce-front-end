import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutfromService } from 'src/app/services/checkoutfrom.service';
import { Checkoutformvalidator } from 'src/app/validators/checkoutformvalidator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
 
  checkoutFormGroup:FormGroup;
  totalPrice: number=0;
  totalQuanity: number=0;
  creditCardYears: number[]=[]
  creditCardMonths: number[]=[]
  countries: Country[]=[];
  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];
  
  constructor(private formBuilder: FormBuilder, private checkOutService: CheckoutfromService, private cartService:CartService, private purchaseService: CheckoutService,
                                    private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();
    
    this.checkoutFormGroup=this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
        lastName:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
        email:new FormControl('',[Validators.required, 
                                            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                                            Checkoutformvalidator.whiteSpaceValidator])
      }),
   shippingAddress: this.formBuilder.group({
    street:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
    city:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
    state:new FormControl('',[Validators.required]),
    country:new FormControl('',[Validators.required]),
    zipCode:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator])    
    }),
    billingAddress: this.formBuilder.group({
      street:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
      city:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]),
      state:new FormControl('',[Validators.required]),
      country:new FormControl('',[Validators.required]),
      zipCode:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator])    
      }),
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required, Validators.minLength(2), Checkoutformvalidator.whiteSpaceValidator]) ,
        cardNumber:new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']   
        })
    })

    //Populate credit card month/years;
    const currentMonth= new Date().getMonth()+1;
    this.checkOutService.getCreditCardMonth(currentMonth).subscribe(
      data=>{
        this.creditCardMonths=data;
      }
    )
    this.checkOutService.getCreditCardYear().subscribe(
      data=>{
        this.creditCardYears=data;
      }
    )
    this.checkOutService.getCountries().subscribe(
      data=>this.countries=data
    )
    
  
   
  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity=>this.totalQuanity=totalQuantity
    )
    this.cartService.totalPrice.subscribe(
      totalprice=>this.totalPrice=totalprice
    )
  }
  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates=this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates=[];
    }

  }
  handleMonthAndYears(){
    const creditCardFormGroup= this.checkoutFormGroup.get('creditCard');
    const currentYear= new Date().getFullYear();
    const selectedYear= Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;
    if(currentYear==selectedYear){
       startMonth=1;
    }
    else {
      startMonth=1;
    }
    this.checkOutService.getCreditCardMonth(startMonth).subscribe(
      data=>this.creditCardMonths=data
    )
  }
  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched()
      return;
    }
    // populate order to be purchased
    let order = new Order();
    order.totalPrice= this.totalPrice;
    order.totalQuantity=this.totalQuanity;

    const cartItem= this.cartService.cartItems;
    let orderItem: OrderItem[]= cartItem.map(cartItem=> new OrderItem(cartItem));

    let purchase= new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order=order;
    purchase.orderItems= orderItem;

    this.purchaseService.placeOrder(purchase).subscribe(
      {
        next: response=> {
          alert(`Your Order has been received. \n Order Tracking Number: ${response.orderTrackingNumber}`)
          this.resetCart()
        },
        error: error=> {
          alert(`There was an error placing  order: ${error.message}`)
        }
      }
      
    )

  }
  resetCart() {
    this.cartService.cartItems=[];
    this.totalQuanity=0;
    this.totalPrice=0;
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }
  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
     this.checkOutService.getStates(countryCode).subscribe(
       data=>{
         if(formGroupName==='shippingAddress')
         this.shippingAddressStates=data;
       
       else {
         this.billingAddressStates=data;
       }
       formGroup.get('state').setValue(data[0]);
      }
     )
      
  }
  get firstName() {     return this.checkoutFormGroup.get('customer.firstName');  }
  get lastName() {     return this.checkoutFormGroup.get('customer.lastName');  }
  get email() {     return this.checkoutFormGroup.get('customer.email');  }
  get shippingAddressStreet() {     return this.checkoutFormGroup.get('shippingAddress.street');  }
  get shippingAddressCity() {     return this.checkoutFormGroup.get('shippingAddress.city');  }
  get shippingAddressCountry() {     return this.checkoutFormGroup.get('shippingAddress.country');  }
  get shippingAddressState() {     return this.checkoutFormGroup.get('shippingAddress.state');  }
  get shippingAddresszipCode() {     return this.checkoutFormGroup.get('shippingAddress.zipCode');  }
  
  get billingAddressStreet() {     return this.checkoutFormGroup.get('billingAddress.street');  }
  get billingAddressCity() {     return this.checkoutFormGroup.get('billingAddress.city');  }
  get billingAddressCountry() {     return this.checkoutFormGroup.get('billingAddress.country');  }
  get billingAddressState() {     return this.checkoutFormGroup.get('billingAddress.state');  }
  get billingAddresszipCode() {     return this.checkoutFormGroup.get('billingAddress.zipCode');  }
  
  get creditCardCardType() {     return this.checkoutFormGroup.get('creditCard.cardType');  }
  get creditCardNameOnCard() {     return this.checkoutFormGroup.get('creditCard.nameOnCard');  }
  get creditCardCardNumber() {     return this.checkoutFormGroup.get('creditCard.cardNumber');  }
  get creditCardSecurtiyCode() {     return this.checkoutFormGroup.get('creditCard.securityCode');  }
  
  
}


