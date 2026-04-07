export { default } from "next-auth/middleware";

export const config = {
  // Protect these routes — unauthenticated users are redirected to /login?callbackUrl=<original>
  matcher: ["/analyze/:path*", "/tailor/:path*", "/themes/:path*", "/chat/:path*"],
};
