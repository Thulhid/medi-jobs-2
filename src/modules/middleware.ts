import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;


  if (pathname === "/signin" || pathname === "/" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }


  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }


  const roleMeta = (token as { role: { metaCode: string } } | null | undefined)?.role?.metaCode?.toUpperCase?.() ?? "";
  const hospitalSlug = (token as { hospitalSlug?: string } | null | undefined)?.hospitalSlug;

  const isAdmin = roleMeta.includes("ADMIN") || roleMeta.includes("SUPER");
  const isRecruiter = roleMeta.includes("RECRUITER");


  if (pathname.startsWith("/admin-dashboard") && isRecruiter) {
    return NextResponse.redirect(new URL("/recruiter-dashboard", req.url));
  }

  if (pathname.startsWith("/recruiter-dashboard") && isAdmin) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }


  if (isRecruiter && hospitalSlug) {
    if (pathname.startsWith("/recruiter-dashboard")) {
      const rest = pathname.slice("/recruiter-dashboard".length);
      return NextResponse.redirect(new URL(`/${hospitalSlug}${rest}`, req.url));
    }

    const slugBase = `/${hospitalSlug}`;
    if (pathname === slugBase || pathname.startsWith(`${slugBase}/`)) {
      const rest = pathname.slice(slugBase.length);
      const dest = `/recruiter-dashboard${rest}`;
      return NextResponse.rewrite(new URL(dest, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/recruiter-dashboard/:path*",
    "/recruiter-:path*",
  ],
};
