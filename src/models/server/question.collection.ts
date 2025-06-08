import { IndexType, Permission } from "node-appwrite";
import { db, questionCollection } from "@/models/name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  //create collection -> can be said to be a table!!!
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Question collection is created!!");

  //create attributes
  /**
   * const result = await databases.createStringAttribute(
        '<DATABASE_ID>', // databaseId
        '<COLLECTION_ID>', // collectionId
        '', // key
        1, // size
        false, // required
        '<DEFAULT>', // default (optional)
        false, // array (optional)
        false // encrypt (optional)
    );
   */
  // This is also valid but slower. The other implementation will call all these in parallel therefore faster!!!
  //   await databases.createStringAttribute(
  //     db, // databaseId
  //     questionCollection, // collectionId
  //     "title", // key
  //     100, // size
  //     true // required
  //   );
  //   await databases.createStringAttribute(
  //     db, // databaseId
  //     questionCollection, // collectionId
  //     "tags", // key
  //     50, // size
  //     true, // required
  //     undefined, // default (optional)
  //     true, // array (optional)
  //     false // encrypt (optional)
  //   );
  //   await databases.createStringAttribute(
  //     db, questionCollection, "content", 10000, true
  //   );
  //   await databases.createStringAttribute(
  //     db, questionCollection, "authorId", 50, true
  //   );
  //   await databases.createStringAttribute(
  //     db, questionCollection, "attachmentId", 50, false
  //   )

  await Promise.all([
    databases.createStringAttribute(
      db, // databaseId
      questionCollection, // collectionId
      "title", // key
      100, // size
      true // required
    ),
    databases.createStringAttribute(
      db, // databaseId
      questionCollection, // collectionId
      "tags", // key
      50, // size
      true, // required
      undefined, // default (optional)
      true, // array (optional)
      false // encrypt (optional)
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);

  console.log("Question attributes created!!");

  await new Promise((resolve) => setTimeout(resolve, 3000)); //stopped execution for a few second to ensure that question collection is created properly before creating indexes.
  //i don't know why await didn't handle it properly but there is a bug ig
  //https://chatgpt.com/share/6842d0ab-6b38-8005-aec3-a4f8dd9b7c5e


  //creating indexes
  /**
   * const result = await databases.createIndex(
    '<DATABASE_ID>', // databaseId
    '<COLLECTION_ID>', // collectionId
    '', // key
    sdk.IndexType.Key, // type
    [], // attributes
    [], // orders (optional)
    [] // lengths (optional)
);
   */
  await Promise.all([
    databases.createIndex(
      db, // databaseId
      questionCollection, // collectionId
      "title", // key
      IndexType.Fulltext, //type
      ["title"], // attributes -> taking title as the attribute
      ["asc"] // orders (optional) ->asc means ascending order
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ["asc"]
    ),
  ]);
  console.log("Question indexes added successfully!!");
}
