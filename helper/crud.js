import { admin } from "../DB/firestore.js";
import dotenv from 'dotenv';

//configure env
dotenv.config();

const db = admin.firestore();

export const createData = async (collectionName, docId, data) => {
    const create = await db.collection(collectionName).doc(docId).set(data);
    return create;
}

export const readAllData = async (collectionName) => {
      //Retrieve user data
      const querySnapshot = await db
        .collection(collectionName)
        .get();
      let queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      return queryData;
}

export const readSingleData = async (collectionName) => {
    //Retrieve user data
    const querySnapshot = await db
      .collection(collectionName)
      .get();
    let queryData = [];
    querySnapshot.forEach((doc) => {
      queryData.push(doc.data());
    });
    return queryData;
}