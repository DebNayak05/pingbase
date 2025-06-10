import { NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";

export function handleApiErrors(error: unknown): NextResponse {
  if (error instanceof AppwriteException) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        // error: error,
        type: error.type,
      },
      {
        status: error.code,
      },
    );
  }
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        // error: error,
        type: "GenericError",
      },
      {
        status: 500,
      },
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "Something went wrong",
      //   error: error,
      type: "UnknownError",
    },
    {
      status: 500,
    },
  );
}
