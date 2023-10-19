const admin = require("firebase-admin");
import { serviceCreds } from "../config/serviceAccount";

admin.initializeApp({
    credential: admin.credential.cert(serviceCreds),
    databaseURL: "https://fir-project-1-58a04.firebaseio.com"
});

let db = admin.firestore();

export const addMessageReaction = async (item: any) => {
    const messageReactionsCollection = await db.collection('messageReactions')
    await messageReactionsCollection.add(item);
}

export const editMessageReaction = async (item: any, messageId: string) => {
    const messageReactionsCollection = await db.collection('messageReactions');
    console.log(item, "Edit message");

    // Query for the document based on 'messageId'.
    const querySnapshot = await messageReactionsCollection.where('messageId', '==', messageId).get();

    // Check if the document exists.
    if (!querySnapshot.empty) {
        // Get the first document from the query (assuming 'messageId' is unique).
        const docRef = querySnapshot.docs[0].ref;

        // Update the document with the new data.
        await docRef.update(item);

        console.log("Document successfully updated!");
    } else {
        console.log("No matching document found for the provided 'messageId'.");
    }
}

export const getMessageReaction = async (messageId: string) => {
    const messageReactionsCollection = await db.collection('messageReactions');
    const querySnapshot = await messageReactionsCollection.where('messageId', '==', messageId).get();

    // Initialize an empty array to store the documents.
    const docs: any = [];

    // Iterate through the query snapshot and add the data of each document to the 'docs' array.
    querySnapshot.forEach((doc: any) => {
        docs.push(doc.data()); // Add the data of the document.
    });

    console.log(docs, "docs");
    return docs[0]; // Return the array of documents.
}
