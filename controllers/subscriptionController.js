import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { createData, readAllData, readFieldData, updateData } from "../helper/crud.js";
// import * as admin from 'firebase-admin';

export const createSubscriptionController = async (req, res) => {
    try {
      const { mentee, mentor, description, start_date, end_date, title } = req.body;
      if (!mentee) {
        return res.send({ message: 'Mentee name is required' });
      }
      if (!mentor) {
        return res.send({ message: 'Mentor name is required' });
      }
      if (!description) {
        return res.send({ message: 'Password is required' });
      }
      if (!title) {
        return res.send({ message: 'Contact is required' });
      }
      if (!start_date) {
        return res.send({ message: 'Address is required' });
      }
      if (!end_date) {
        return res.send({ message: 'Address is required' });
      }

      //existing session
    //   const querySnapshot = await db
    //     .collection(process.env.sessionCollectionName)
    //     .where('id', '==', id)
    //     .get();
    //   if (!querySnapshot.empty) {
    //     return res.status(200).send({
    //       success: false,
    //       message: 'User already registered. Please login.',
    //     });
    //   }

      
  const weeklySchedule = [];
  let currentDate = new Date(start_date);
  const finish_date = new Date(end_date);

  while (currentDate <= finish_date) {
    const subscriptionJson = {
      mentor: mentor,
      mentee: mentee,
      description: description,
      schedule: new Date(currentDate),
      title: title,
    };
    weeklySchedule.push(subscriptionJson);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  const sessionData = await readFieldData(process.env.menteesCollectionName, username, "subscription");
  const schedule = {
    sessionData,
    mentor: weeklySchedule
  }
  
      // await db.collection(process.env.menteesCollectionName).doc(userId).set(userJson);
      updateData(process.env.menteesCollectionName, mentee, "subscription", schedule);
      updateData(process.env.mentorsCollectionName, mentor, "subscription", schedule);
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'Session created successfully',
        schedule: schedule,
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


  export const readSubscriptionController = async (req, res) => {
    try {
        const {username} = req.body;
      const sessionData = await readFieldData(process.env.menteesCollectionName, username, "subscription");
  
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'Session readed successfully',
        session: sessionData,
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
