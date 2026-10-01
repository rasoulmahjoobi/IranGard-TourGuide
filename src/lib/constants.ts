export const SITE_NAME = "ایران گرد تور";

export const ROUTES = {
  home: "/",
  domestic: "/domestic",
  category: (id: string) => `/category/${id}`,
  subcategory: (id: string) => `/subcategory/${id}`,
  product: (id: string) => `/product/${id}`,
  cart: "/cart",
  orders: "/orders",
  checkout: "/checkout",
  login: "/login",
  register: "/register",
  paymentSuccess: (id: string) => `/payment/successPayment/${id}`,
  paymentUnsuccess: (id: string) => `/payment/unsuccessPayment/${id}`,
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  adminInventory: "/admin/inventory",
  adminOrders: "/admin/orders",
} as const;