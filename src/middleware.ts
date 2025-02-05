import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {jwtDecode} from "jwt-decode";
export function middleware(request: NextRequest) {
  // const loginRoute = `${request.nextUrl.origin}/login`;
  const homeRoute = `${request.nextUrl.origin}/login`;
  // const dashboardRoute = `${request.nextUrl.origin}/dashboard`;
  // const adminRoutes = ["/", "/add-product", "/all-products", "/transaction", "/users", "/order-history"]
  const token = request?.cookies?.get('accessToken')?.value;
  
  // if (!token) {
  //   return NextResponse.redirect(new URL(homeRoute, request.url));
  // }
  // const userInfo =  jwtDecode(token as string)

  // const currentPath = request.nextUrl.pathname;

  // Redirect based on role and route
  // if ('role' in userInfo && userInfo?.role !== 'SUPERADMIN' && adminRoutes.some((e) => currentPath.startsWith(e))) {
  //   // Prevent ADMIN from accessing /services
  //   return NextResponse.redirect(new URL(homeRoute, request.url));
  // }

  // Allow the request to proceed if the token exists
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/add-product", "/all-products", "/transaction", "/users", "/order-history"], // Apply middleware to the /services route
};
