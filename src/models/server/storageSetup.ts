import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    //try to get if the storage is already there
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage connected");
  } catch (error) {
    console.log(error);
    try {
      await storage.createBucket(
        questionAttachmentBucket, // bucketId
        questionAttachmentBucket, // name
        [
          Permission.read("any"),
          Permission.create("users"),
          Permission.read("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ], // permissions (optional)
        false, // fileSecurity (optional)
        undefined, // enabled (optional)
        undefined, // maximumFileSize (optional)
        ["jpg", "png", "gif", "jpeg", "webp", "heic"], // allowedFileExtensions (optional)
        undefined, // compression (optional)
        undefined, // encryption (optional)
        undefined, // antivirus (optional)
      );
    } catch (error) {
      console.log("Error creating storage :( : ", error);
    }
  }
}
