export const SITE_NAME = "ایران گرد تور";

export const ROUTES = {
  home: "/",
  category: (slug: string) => `/category/${slug}`,
  product: (slug: string) => `/product/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  paymentResult: "/payment/result",
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  adminInventory: "/admin/inventory",
  adminOrders: "/admin/orders",
} as const;