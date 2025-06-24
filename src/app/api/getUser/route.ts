import { handleApiErrors } from "@/lib/errors.server";
import { users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { UserDetails } from "@/types/types";
export async function POST(request:NextRequest) {
    try {
        const {userId} = await request.json();
        const user = await users.get(userId);
        const userDetails : UserDetails = {
            name : user.name,
            email : user.email,
            created : new Date(user.$createdAt),
            lastOnline : new Date(user.$updatedAt),
            karma : user.prefs.reputation
        }
        return NextResponse.json({message : "User fetched", user : userDetails}, {status:200});
    } catch (error) {
        return handleApiErrors(error);
    }
}