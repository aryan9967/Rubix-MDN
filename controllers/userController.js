import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readSingleData, updateData } from "../helper/crud.js";
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
        const querySnapshot = await db
          .collection(process.env.mentorsCollectionName)
          .get();
        let mentorData = [];
        querySnapshot.forEach((doc) => {
          mentorData.push(doc.data());
        });
        console.log(mentorData)
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
        console.log(mentorSnapshot);
        console.log(mentorSnapshot.preference);
        if (mentorSnapshot.preference && typeof mentorSnapshot.preference === 'object') {
          // Iterate over properties of the preference object
            var userData = [];
          for (const domain in mentorSnapshot.preference) {
            if (mentorSnapshot.preference.hasOwnProperty(domain)) {
              console.log('domain: ', domain);
              const querySnapshot = await db
                .collection(process.env.mentorsCollectionName)
                .where('profession', '==', domain)
                .get();
              querySnapshot.forEach((doc) => {
                userData.push(doc.data());
              });
        
              if (!userData) {
                return res.status(404).send({
                  success: false,
                  message: 'No mentors still exists',
                });
              }
              

              // Process userData as needed
              console.log(`Mentors for domain ${domain}:`, userData);
            }
          }
          // console.log("userdata: ", userData.map(mentor => ({}));

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
          console.log(mentorsArray);

          res.status(200).send({
            success: true,
            message: 'All Mentors List with preference',
            mentors: {
              mentors: mentorsArray,
            },   
        });
        } else {
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
          // console.error('Preference is not an object:', mentorSnapshot.preference);
        }
        
        
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

      //validating user
      if (!mentorRef) {
        return res.status(404).send({
          success: false,
          message: 'No such mentor exists',
        });
      }

    // Update the specific field in the document
    updateData(process.env.mentorsCollectionName, mentor_username, approved, true);
  
    const mentor_data = readSingleData(process.env.mentorsCollectionName, mentor_username);
  
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


      const userRef = readSingleData(process.env.mentorsCollectionName, mentor_username);
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