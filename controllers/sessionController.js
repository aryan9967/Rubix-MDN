import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { createData, readAllData, updateData } from "../helper/crud.js";
// import * as admin from 'firebase-admin';

export const createSessionController = async (req, res) => {
    try {
      const { name, id, description, mentor, date, paid, price, enrollment } = req.body;
      if (!name) {
        return res.send({ message: 'Name is required' });
      }
      if (!id) {
        return res.send({ message: 'Email is required' });
      }
      if (!description) {
        return res.send({ message: 'Password is required' });
      }
      if (!mentor) {
        return res.send({ message: 'Contact is required' });
      }
      if (!date) {
        return res.send({ message: 'Address is required' });
      }
      if (!paid) {
        return res.send({ message: 'Age is required' });
      }
      if (!price) {
        return res.send({ message: 'Preference is required' });
      }
      if (!enrollment) {
        return res.send({ message: 'Preference is required' });
      }

      //existing session
      const querySnapshot = await db
        .collection(process.env.sessionCollectionName)
        .where('id', '==', id)
        .get();
      if (!querySnapshot.empty) {
        return res.status(200).send({
          success: false,
          message: 'User already registered. Please login.',
        });
      }
  
      const sessionJson = {
        name: name,
        id: id,
        description: description,
        mentor: mentor,
        date: date,
        paid: paid,
        price: price,
        enrollment: enrollment,
      };
      const sessionId = id; // Use email as the document ID
  
      // await db.collection(process.env.menteesCollectionName).doc(userId).set(userJson);
      createData(process.env.sessionCollectionName, sessionId, sessionJson);
      updateData(process.env.mentorsCollectionName, mentor, "session", sessionJson)
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'Session created successfully',
        session: sessionJson,
      });
    } catch (error) {
      console.error('Error in creating session:', error);
      return res.status(500).send({
        success: false,
        message: 'Error in creating session',
        error: error.message,
      });
    }
  };

  export const readSessionsController = async (req, res) => {
    try {
        console.log(process.env.sessionCollectionName);
      const sessionData = await readAllData(process.env.sessionCollectionName);
      console.log(process.env.sessionCollectionName);
      const sessionArray = sessionData.map(session => ({
        [session.id]: {
          "id": session.id,
          "data": {
            "date": session.date,
            "mentor": session.mentor,
            "price": session.price,
            "name": session.name,
            "paid": session.paid,
            "description": session.description,
            "id": session.id,
            "enrollment": session.enrollment
          }
        }
      }));
  
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'Session readed successfully',
        session: sessionArray,
      });
    } catch (error) {
      console.error('Error in reading session:', error);
      return res.status(500).send({
        success: false,
        message: 'Error in reading session',
        error: error.message,
      });
    }
  };
