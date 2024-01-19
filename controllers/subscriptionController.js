import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { createData, readAllData, readFieldData, readSingleData, updateData } from "../helper/crud.js";
// import * as admin from 'firebase-admin';

export const createSubscriptionController = async (req, res) => {
    try {
      const { mentee, mentor, title, description, rate, start_date, end_date } = req.body;
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
      if (!rate) {
        return res.send({ message: 'Rate is required' });
      }
      if (!start_date) {
        return res.send({ message: 'Address is required' });
      }
      if (!end_date) {
        return res.send({ message: 'Address is required' });
      }

      const sub_username = mentor+'_'+mentee;
      //existing session
      const querySnapshot = await db
        .collection(process.env.menteesCollectionName)
        .where('sub_username', '==', sub_username)
        .get();
      if (!querySnapshot.empty) {
        return res.status(200).send({
          success: false,
          message: 'Subscription already registered. Please login.',
        });
      }

      
  const weeklySchedule = [];
  let currentDate = new Date(start_date);
  const finish_date = new Date(end_date);

  while (currentDate <= finish_date) {
    const subscriptionJson = {
      sub_username: sub_username,
      mentor: mentor,
      mentee: mentee,
      description: description,
      schedule: currentDate,
      title: title,
      rate: rate
    };
    weeklySchedule.push(subscriptionJson);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  const mentee_schedule = {
    [mentor]: [...weeklySchedule]
  }
  const mentor_schedule = {
    [mentee]: [...weeklySchedule]
  }
  const sessionData = await readFieldData(process.env.menteesCollectionName, mentee, "subscription");

  const mentee_sub = await readSingleData(process.env.menteesCollectionName, mentee);
  const mentor_sub = await readSingleData(process.env.mentorsCollectionName, mentor);
  console.log("mentee_sub: ", mentee_sub);
  
      // await db.collection(process.env.menteesCollectionName).doc(userId).set(userJson);
      await updateData(process.env.menteesCollectionName, mentee, "subscription", mentee_schedule);
      await updateData(process.env.mentorsCollectionName, mentor, "subscription", mentor_schedule);


      return res.status(201).send({
        success: true,
        message: 'Session created successfully',
        mentee: mentee_sub,
        mentor: mentor_sub,
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
      const { username } = req.body;
      const subData = await readFieldData(process.env.menteesCollectionName, username, "subscription");
  
      if (!subData || !subData.aryan123 || !subData.aryan123[0]) {
        // Check if subData or its properties are undefined
        return res.status(404).send({
          success: false,
          message: 'No subscription data found for the specified user.',
        });
      }
  
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'Session read successfully',
        session: subData,
        mentor: subData.aryan123[0].mentor,
        mentee: subData.aryan123[0].mentee,
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
  


  export const singleSubscriptionController = async (req, res) => {
    try {
        const {mentee_username, mentor_username} = req.body;
        const subData = await readFieldData(process.env.menteesCollectionName, mentee_username, "subscription");
    
        // const test = subscription_data[mentee_username]
  
      return res.status(201).send({
        success: true,
        message: 'Session readed successfully',
        subscription: subData,
        // test: test,
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