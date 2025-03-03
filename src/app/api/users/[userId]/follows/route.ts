import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "followers";

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { userId: clerkId } = await auth();
    let currentUserId: string | null = null;
    
    if (clerkId) {
      const currentUser = await prisma.user.findUnique({
        where: { clerkid: clerkId },
        select: { id: true }
      });
      if (currentUser) {
        currentUserId = currentUser.id;
      }
    }

    if (type === "followers") {
      const followers = await prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            }
          }
        },
      });

      const formattedFollowers = followers.map(follow => follow.follower);
      return NextResponse.json(formattedFollowers);
    } else {
      const following = await prisma.follow.findMany({
        where: {
          followerId: userId,
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            }
          }
        },
      });

      const formattedFollowing = following.map(follow => follow.following);
      return NextResponse.json(formattedFollowing);
    }
  } catch (error) {
    console.error("Error fetching follows:", error);
    return NextResponse.json(
      { error: "Failed to fetch follows" },
      { status: 500 }
    );
  }
}