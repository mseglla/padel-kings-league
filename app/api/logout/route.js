import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);

  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  res.cookies.set("auth", "", { path: "/", maxAge: 0 });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });

  return res;
}
