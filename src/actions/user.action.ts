"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const {userId} = await auth();
        const user = await currentUser();

        if(!userId || !user) return;

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkid: userId
            }
        });

        if(existingUser) {
            return existingUser;
        }
        const dbUser = await prisma.user.create({
            data: {
                clerkid:userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`, 
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            }
        });

        return dbUser;
    } catch (error) {
        console.log("Error syncing user", error);
    }
}

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: {
        clerkid:clerkId,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}