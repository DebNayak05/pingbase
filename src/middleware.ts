import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  /**match all request paths to the middleware except for the ones that starts with -
   * -- api
   * -- favicon.ico
   * -- _next/static
   * -- _next/image
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
