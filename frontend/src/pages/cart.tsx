import {useEffect, useState} from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "macbookair3",
    name: "MacBook Air",
    photo: "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg",
    price: 219999,
    quantity: 5,
    stock: 20,
  }
];
const subTotal = 20000;
const shippingCharges = 250;
const tax = Math.round(subTotal * 0.18);
const discount = 200;
const total = subTotal + shippingCharges + tax - discount;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if(Math.random() > 0.5 && couponCode.length === 6) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);
    return (() => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false)
    })
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length === 0 ? <h1>Item Not Added</h1> : 
        cartItems.map((i, indx) => <CartItem key = {indx} cartItems={i}/>)
        }
      </main>

      <aside>
        <p>Subtotal: ₹{subTotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>Discount: <em className="red">- ₹{discount}</em></p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        {/**coupon code logic */}
        <input type = "text" placeholder="Coupon Code" value = {couponCode} onChange={(e) => setCouponCode(e.target.value)}></input>
        {couponCode && (
            isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using the <code>{couponCode}</code> 
              </span>
               ) : (
               <span className="red">
                <VscError />
                Invalid coupon code!
               </span>
              )
        )}
        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link> }
      </aside>
    </div>
  )
}

export default Cart