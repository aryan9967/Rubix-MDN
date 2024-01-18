import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readAllData } from "../helper/crud.js";
import { sms } from "../helper/sms.js";
import { mail } from "../helper/mail.js";
// import * as admin from 'firebase-admin';
import mime from 'mime';
import multer from 'multer';

// Initialize multer for handling file uploads
const upload = multer();

const storage = getStorage(fapp);

export const listMentorsController = async (req, res) => {
    try {
      const { username } = req.body;
      //Validtion
      if (!username) {      
        //Retrieve user data
        const mentorData = readAllData(process.env.mentorsCollectionName);
    
        //validating user
        if (!mentorData) {
          return res.status(404).send({
            success: false,
            message: 'No mentors still exists',
          });
        }
        
        const mentorsArray = mentorData.map(mentor => ({
          [mentor.username]: {
            "username": mentor.username,
            "data": {
              "profession": mentor.profession,
              "password": mentor.password,
              "approved": mentor.approved,
              "address": mentor.address,
              "role": mentor.role,
              "contact": mentor.contact,
              "name": mentor.name,
              "subscription": mentor.subscription,
              "experience": mentor.experience,
              "email": mentor.email,
              "age": mentor.age,
              "username": mentor.username
            }
          }
        }));

        res.status(200).send({
            success: true,
            message: 'All Mentors List',
            mentors: {
              mentors: mentorsArray,
            },   
        });
      } else {  

        const userRef = db.collection(process.env.menteesCollectionName).doc(username).get();
        const mentorSnapshot = (await userRef).data();
        mentorSnapshot.preference.forEach(async (domain) => {
            //Retrieve user data
          const querySnapshot = await db
          .collection(process.env.mentorsCollectionName)
          .where('prerence', '==', domain)
          .get();
          let userData = [];
          querySnapshot.forEach((doc) => {
              userData.push(doc.data());
          });
        })
      //Retrieve user data
      const querySnapshot = await db
        .collection(process.env.mentorsCollectionName)
        .where('approved', '==', false)
        .get();
      let userData = [];
      querySnapshot.forEach((doc) => {
        userData.push(doc.data());
      });
  
      //validating user
      if (!userData) {
        return res.status(404).send({
          success: false,
          message: 'No mentors still exists',
        });
      }
      
      const mentorsArray = userData.map(mentor => ({
        [mentor.username]: {
          "username": mentor.username,
          "data": {
            "profession": mentor.profession,
            "password": mentor.password,
            "approved": mentor.approved,
            "address": mentor.address,
            "role": mentor.role,
            "contact": mentor.contact,
            "name": mentor.name,
            "subscription": mentor.subscription,
            "experience": mentor.experience,
            "email": mentor.email,
            "age": mentor.age,
            "username": mentor.username
          }
        }
      }));
      res.status(200).send({
          success: true,
          message: 'All Mentors List with preference',
          mentors: {
            mentors: mentorsArray,
          },   
      });
      }

      //Retrieve user data
      
      console.log('success');
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in login of mentor',
        error: error,
      });
    }
  };

  export const approveMentorController = async (req, res) => {
    try {
      const { admin_username, mentor_username } = req.body;
      //Validtion
      if (!admin_username) {
        return res.status(404).send({
          success: false,
          message: 'Username is not provided',
        });
      }

    // Reference to the Firestore document
    const mentorRef = db.collection(process.env.mentorsCollectionName).doc(mentor_username);


      //validating user
      if (!mentorRef) {
        return res.status(404).send({
          success: false,
          message: 'No such mentor exists',
        });
      }

    // Update the specific field in the document
    await mentorRef.update({
      approved: true,
    });
  
    const mentor_data = mentorRef.get(); 
  
      res.status(200).send({
        success: true,
        message: 'Approved Mentor',
        mentors: {
            mentor: (await mentor_data).data(),
        }
      });
      console.log('success');
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in login of mentor',
        error: error,
      });
    }
  };
  
  export const mentorDetailsController = async (req, res) => {
    try {
      const { mentor_username } = req.body;
      if (!mentor_username) {
        return res.send({ message: 'No such mentor exists' });
      }


      const userRef = db.collection(process.env.mentorsCollectionName).doc(mentor_username).get();
      const mentorSnapshot = (await userRef).data();

      console.log('success');

      // mail('amitasharma.m@gmail.com');
      
      return res.status(201).send({
        success: true,
        message: 'Mentor details',
        mentor_details: mentorSnapshot,
      });
    } catch (error) {
      console.error('Error in Mentor details:', error);
      return res.status(500).send({
        success: false,
        message: 'Error in getting mentor details',
        error: error.message,
      });
    }
  };