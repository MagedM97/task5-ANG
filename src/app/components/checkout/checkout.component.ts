import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartLine } from 'src/app/interfaces/cart-line';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {

  constructor(private auth: AuthService,private order: OrderService ,private storage:StorageService) {
    this.cartLines = storage.getCartLines();
  }
  cartLines: CartLine[] = [];
placeOrder = new FormGroup({
 lName: new FormControl('',Validators.required),
 fName: new FormControl('',Validators.required),
 mail: new FormControl('',Validators.email),
 phone: new FormControl('',Validators.pattern("[0-9]+")),
 adress1: new FormControl('',Validators.required),
 adress2: new FormControl('',Validators.required),
 city: new FormControl('',Validators.required),
 ZIP: new FormControl('',Validators.pattern("[0-9]+"))


 
})
date(){
 var d = new Date();
return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();}
Order(){
 
  var body=JSON.stringify({
    "sub_total_price": this.getSubTotal(),
    "shipping": this.getShipping,
    "total_price": this.getTotal,
    "the_Date":this.date(),
    "user_id": this.auth.id(),
    
    "order_details": [JSON.parse(localStorage.getItem('products')||"")
  
  ],
  "shipping_info": this.placeOrder.value
  })
  if(this.placeOrder.valid){
    console.log(this.placeOrder.value)
    this.order.order(body).subscribe((data: any)=>{console.log(data)})

  }
  

}
  

  

  getTotal(): number {
    return this.getShipping() + this.getSubTotal();
  }
  getSubTotal(): number {
    return this.cartLines
      .map((x) => x.price * x.quantity)
      .reduce((a, v) => (a += v), 0);
  }
  getShipping(): number {
    return (
      this.cartLines.map((x) => x.quantity).reduce((a, v) => (a += v), 0) * 2
    );
  }
}
