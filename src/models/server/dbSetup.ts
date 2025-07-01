import { db } from "../name";
import createQuestionCollection from "./question.collection";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    try {
      await databases.create(db, db);
      console.log("database created");
      //create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("Collection created successfully");
      console.log("Database connected");
    } catch (error) {
      console.log("Error creating databases or collection", error);
    }
  }

  return databases;
}
