import { questionAttachmentBucket } from "@/models/name";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "fra.cloud.appwrite.io",
    //     port: "",
    //     // pathname: "/v1/storage/buckets/**/files/**/view?=",
    //     pathname: `/v1/storage/buckets/${questionAttachmentBucket}/files/**/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    //     search: "",
    //   },
    // ],
    remotePatterns: [
      new URL(
        `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${questionAttachmentBucket}/files/**/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      ),
    ],
  },
};

export default nextConfig;
