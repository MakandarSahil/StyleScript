// CartPage.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {
  Trash2,
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  color: string
  size: string
  price: number
  quantity: number
  image: string
  isCustom: boolean
}

function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "custom-1",
      name: "Custom T-Shirt",
      color: "#3B82F6",
      size: "M",
      price: 29.99,
      quantity: 1,
      image: "/images/custom-tshirt.jpg",
      isCustom: true
    },
    {
      id: "jacket-2",
      name: "Classic Denim Jacket",
      color: "#1E40AF",
      size: "L",
      price: 59.99,
      quantity: 1,
      image: "/images/denim-jacket.jpg",
      isCustom: false
    }
  ])

  const [checkoutStep, setCheckoutStep] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [orderComplete, setOrderComplete] = useState<boolean>(false)

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleContinueToShipping = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutStep(2)
    window.scrollTo(0, 0)
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutStep(3)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
      window.scrollTo(0, 0)
    }, 2000)
  }

  const goBackToShopping = () => {
    navigate({ to: "/catalog" })
  }

  const validateStep1 = () => {
    return formData.email && formData.firstName && formData.lastName
  }

  const validateStep2 = () => {
    return formData.address && formData.city && formData.state && formData.zipCode
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={goBackToShopping}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
            <p className="text-gray-600 mb-6">Order #ORD-{Math.floor(100000 + Math.random() * 900000)}</p>

            <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-lg text-left mb-8">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2 text-gray-900">
                  <span>Order Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                We've sent a confirmation email to {formData.email} with your order details.
              </p>
              <button
                onClick={goBackToShopping}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={goBackToShopping}
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4">
              <h2 className="text-lg font-medium mb-4 pb-2 border-b">Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div
                          className="w-12 h-12 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            <div>Size: {item.size}</div>
                            <div className="flex items-center">
                              <span>Color:</span>
                              <div
                                className="ml-1 w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></div>
                            </div>
                          </div>
                          {item.isCustom && (
                            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Custom Design
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <button
                            className="w-6 h-6 bg-gray-100 rounded-l flex items-center justify-center"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-8 h-6 text-center text-sm border-y border-gray-200"
                          />
                          <button
                            className="w-6 h-6 bg-gray-100 rounded-r flex items-center justify-center"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4">
              <h2 className="text-lg font-medium mb-4 pb-2 border-b">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Steps */}
              <div className="mt-6">
                <div className="flex mb-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${checkoutStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {step}
                      </div>
                      <div className="text-xs mt-1 text-gray-500">
                        {step === 1 && "Info"}
                        {step === 2 && "Shipping"}
                        {step === 3 && "Payment"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step 1: Customer Info */}
                {checkoutStep === 1 && (
                  <form onSubmit={handleContinueToShipping}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleFormChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleFormChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!validateStep1()}
                      className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${validateStep1() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Continue to Shipping
                    </button>
                  </form>
                )}

                {/* Step 2: Shipping Info */}
                {checkoutStep === 2 && (
                  <form onSubmit={handleContinueToPayment}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleFormChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleFormChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleFormChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!validateStep2()}
                        className={`py-2 px-4 rounded-md text-white font-medium ${validateStep2() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Payment Info */}
                {checkoutStep === 3 && (
                  <form onSubmit={handlePlaceOrder}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleFormChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleFormChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleFormChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            id="cardCvc"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleFormChange}
                            placeholder="123"
                            maxLength={3}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <ShieldCheck className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Your payment information is secure</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Truck className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Estimated delivery: 3-5 business days</span>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(2)}
                        className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="py-3 px-6 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 flex items-center"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Processing...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage