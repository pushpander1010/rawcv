export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/analyze/:path*", "/tailor/:path*", "/themes/:path*", "/chat/:path*", "/credits/:path*"],
};
