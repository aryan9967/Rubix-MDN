import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { comparePassword, hashPassword } from '../helper/authHelper.js';

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
  
  
      res.status(200).send({
        success: true,
        message: 'Unapproved Mentors List',
        mentors: {
            unapprovedMentors: userData
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
  