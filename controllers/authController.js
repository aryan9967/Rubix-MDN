import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { createData } from "../helper/crud.js";
// import * as admin from 'firebase-admin';
import { comparePassword, hashPassword } from '../helper/authHelper.js';
import mime from 'mime';
import multer from 'multer';


// Initialize multer for handling file uploads
const upload = multer();

const storage = getStorage(fapp);

export const menteesRegisterController = async (req, res) => {
    try {
      const { username, name, email, password, contact, address, age, preference } = req.body;
      if (!username) {
        return res.send({ message: 'Username is not provided' });
      }
      if (!name) {
        return res.send({ message: 'Name is required' });
      }
      if (!email) {
        return res.send({ message: 'Email is required' });
      }
      if (!password) {
        return res.send({ message: 'Password is required' });
      }
      if (!contact) {
        return res.send({ message: 'Contact is required' });
      }
      if (!address) {
        return res.send({ message: 'Address is required' });
      }
      if (!age) {
        return res.send({ message: 'Age is required' });
      }
      if (!preference) {
        return res.send({ message: 'Preference is required' });
      }
      //existing user
      const querySnapshot = await db
        .collection(process.env.menteesCollectionName)
        .where('username', '==', username)
        .get();
      if (!querySnapshot.empty) {
        return res.status(200).send({
          success: false,
          message: 'User already registered. Please login.',
        });
      }

      //register user
      const hashedPassword = await hashPassword(password);
  
      const userJson = {
        username: username,
        name: name,
        email: email,
        password: hashedPassword,
        contact: contact,
        address: address,
        age: age,
        preference: preference,
        subscribed: [],
        role: 0,
      };
      const userId = username; // Use email as the document ID
  
      if (typeof hashedPassword !== 'string') {
        return res.status(500).send({
          success: false,
          message: 'Error in registration: Invalid password',
        });
      }
  
      // await db.collection(process.env.menteesCollectionName).doc(userId).set(userJson);
      createData(process.env.menteesCollectionName, userId, userJson);
      console.log('success');
  
      return res.status(201).send({
        success: true,
        message: 'User registered successfully',
        user: userJson,
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

  export const mentorsRegisterController = async (req, res) => {
    try {// Use multer middleware to parse form data
      upload.single('resume')(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ success: false, message: 'Error uploading file' });
        }
  
        const {
          username,
          name,
          email,
          password,
          contact,
          address,
          age,
          profession,
          experience,
        } = req.body;
        const resume = req.file;
        const extension = mime.getExtension(req.file.mimetype);
        console.log(req.file.originalname);
        console.log(username);
        // console.log("req.body: ", req.body);
        // console.log("req.file: ", req.file);
  
        if (!username) {
          return res.send({ message: 'Username is not provided' });
        }
        if (!name) {
          return res.send({ message: 'Name is required' });
        }
        if (!email) {
          return res.send({ message: 'Email is required' });
        }
        if (!password) {
          return res.send({ message: 'Password is required' });
        }
        if (!contact) {
          return res.send({ message: 'Contact is required' });
        }
        if (!address) {
          return res.send({ message: 'Address is required' });
        }
        if (!age) {
          return res.send({ message: 'Age is required' });
        }
        if (!profession) {
          return res.send({ message: 'Profession is required' });
        }
        if (!experience) {
          return res.send({ message: 'Experience is required' });
        }
        if (!resume) {
          return res.status(400).send({ message: 'Resume file is required' });
        }

      // const storageRef = ref(storage);
      // const folderRef = ref(storageRef, 'resume');
      // const metadata = {
      //   contentType: 'application/pdf',
      // };
      // const fileRef = ref(folderRef, resume.originalname);

      // console.log('b uploadbytes');

      // Upload resume file to Firebase Storage
      // await uploadBytes(fileRef, resume.buffer, metadata);

      // Get the download URL for the uploaded resume
      // const resumeURL = await getDownloadURL(fileRef);

      // console.log('Resume uploaded successfully:', resumeURL);

        // Check for existing user
        const querySnapshot = await db
          .collection(process.env.mentorsCollectionName)
          .where('email', '==', email)
          .get();
        if (!querySnapshot.empty) {
          return res.status(200).send({
            success: false,
            message: 'User already registered. Please login.',
          });
        }

        // Register user in Firestore
        const hashedPassword = await hashPassword(password);
  
        const userJson = {
          username,
          name,
          email,
          password: hashedPassword,
          contact,
          address,
          age,
          profession,
          experience: 3,
          subscription: 0,
          // resume: resumeURL,
          approved: false,
          role: 1,
        };
  
        if (typeof hashedPassword !== 'string') {
          return res.status(500).send({
            success: false,
            message: 'Error in registration: Invalid password',
          });
        }
  
        // Save user details to Firestore
        await db.collection(process.env.mentorsCollectionName).doc(username).set(userJson);
        console.log('User registered successfully');
  
        // res.status(201).send({
        //   success: true,
        //   message: 'User registered successfully',
        //   user: userJson,
        // });

        const bucket = admin.storage().bucket();
        const folderPath = 'resume';
        const fileName = username+'.'+extension;
        const filePath = `${folderPath}/${fileName}`;
        const file = bucket.file(filePath);
        const stream = file.createWriteStream({
          metadata: {
            contentType: 'application/pdf'
          }
        });
        stream.on('error', (err) => {
          console.log(err);
          res.status(500).send("Error uploading file");
        });

        stream.on("finish", () => {
          res.status(200).send({
            success: true,
            message: 'Mentor Registered successfully',
            mentor: {userJson
            },
            filePath: filePath,
          });
        });

        stream.end(req.file.buffer);
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
  

  export const menteesLoginController = async (req, res) => {
    try {
      const { username, password } = req.body;
      //Validtion
      if (!username || !password) {
        return res.status(404).send({
          success: false,
          message: 'Invalid email or password',
        });
      }
      //Retrieve user data
      const querySnapshot = await db
        .collection(process.env.menteesCollectionName)
        .where('username', '==', username)
        .get();
      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });
  
      //validating user
      if (!userData) {
        return res.status(404).send({
          success: false,
          message: 'User is not registered',
        });
      }
  
      //comparing user password with hashed/encrypted password
      const match = await comparePassword(password, userData.password);
      //verifying password
      if (!match) {
        return res.status(200).send({
          success: false,
          message: 'Invalid Password',
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Login successfully',
        user: {
          username: userData.username,
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          address: userData.address,
          age: userData.age,
          subscribed: userData.subscribed,
          preference: userData.preference,
          role: userData.role,
        }
      });
      console.log('success');
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in login of mentee',
        error: error,
      });
    }
  };
  

  export const mentorsLoginController = async (req, res) => {
    try {
      const { username, password } = req.body;
      //Validtion
      if (!username || !password) {
        return res.status(404).send({
          success: false,
          message: 'Invalid email or password',
        });
      }
      //Retrieve user data
      const querySnapshot = await db
        .collection(process.env.mentorsCollectionName)
        .where('username', '==', username)
        .get();
      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });
  
      //validating user
      if (!userData) {
        return res.status(404).send({
          success: false,
          message: 'User is not registered',
        });
      }
  
      //comparing user password with hashed/encrypted password
      const match = await comparePassword(password, userData.password);
      //verifying password
      if (!match) {
        return res.status(200).send({
          success: false,
          message: 'Invalid Password',
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Login successfully',
        user: {
          username: userData.username,
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          address: userData.address,
          age: userData.age,
          profession: userData.profession,
          experience: userData.experience,
          subscription: userData.subscription,
          approved: userData.approved,
          role: userData.role,
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
  