import { clerkMiddleware, createRouteMatcher, getAuth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

const isPrivateRoute = createRouteMatcher(["/events(.*)", "/gallery(.*)", "/members(.*)", "/profile(.*)"])



export default clerkMiddleware(async (auth, request) => {
  const cookieStore = await cookies()
  const convex_user_id = cookieStore.get('convex_user_id')
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  if(!convex_user_id && isPrivateRoute(request)) {
    return NextResponse.redirect(`${process.env.SITE_URL}/onboarding`)
  }
 
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
