import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { comparePassword, hashPassword } from '../helper/authHelper.js';

import slugify from 'slugify';

export const unapprovedMentorsController = async (req, res) => {
    try {
      const { username } = req.body;
      //Validtion
      if (!username) {
        return res.status(404).send({
          success: false,
          message: 'Username is not provided',
        });
      }

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

      const unapprovedMentorsArray = userData.map(mentor => ({
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
        message: 'Unapproved Mentors List',
        mentors: {
          unapprovedMentors: unapprovedMentorsArray,
        },      
        
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
  
  export const createOfferController = async (req, res) => {
    try {
      const { username, offer_name, offer_desc, mentor_name, preference, price, expiry } = req.body;
      if (!username) {
        return res.send({ message: 'Username is not provided' });
      }
      if (!offer_name) {
        return res.send({ message: 'Name is required' });
      }
      if (!offer_desc) {
        return res.send({ message: 'Email is required' });
      }
      if (!mentor_name) {
        return res.send({ message: 'Password is required' });
      }
      if (!price) {
        return res.send({ message: 'Contact is required' });
      }
      if (!expiry) {
        return res.send({ message: 'Address is required' });
      }
      if (!preference) {
        return res.send({ message: 'Preference is required' });
      }
      //existing user
      const querySnapshot = await db
        .collection(process.env.offerCollectionName)
        .where('offer_name', '==', offer_name)
        .get();
        // console.log(querySnapshot.docs);
      if (!querySnapshot.empty) {
        return res.status(200).send({
          success: false,
          message: 'Offer already exists.',
        });
      }

      const userJson = {
        username: username,
        offer_name: offer_name,
        offer_desc: offer_desc,
        mentor_name: mentor_name,
        price: price,
        expiry: expiry,
        preference: preference,
        purchased: 0,
      };
      const userId = slugify(offer_name); // Use username as the document ID
  
      await db.collection(process.env.offerCollectionName).doc(userId).set(userJson);
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'User registered successfully',
        user: userJson,
        offer_id: slugify(userJson.offer_name),
      });
    } catch (error) {
      console.error('Error in registration:', error);
      return res.status(500).send({
        success: false,
        message: 'Error in registration',
        error: error.message,
      });
    }
  };
