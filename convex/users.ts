import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    fullName: v.string(),
    registerNumber: v.string(),
    courseName: v.string(),
    courseYear: v.string(),
    phoneNumber: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // const cookieStore = await cookies();
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return existingUser._id;

    const userId = await ctx.db.insert("users", {
      fullName: args.fullName,
      registerNumber: args.registerNumber,
      courseName: args.courseName,
      courseYear: args.courseYear,
      phoneNumber: args.phoneNumber,
      clerkId: args.clerkId,
    });

    // cookieStore.set({
    //   name: "convex_user_id",
    //   value: userId,
    //   httpOnly: true,
    //   path: "/",
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    // });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) return;

    return user;
  },
});
