import multer from 'multer';
import { db, storage } from "../DB/firebase.js";
import { hashPassword } from '../helper/authHelper.js';

const upload = multer();

export const mentorsRegisterController = async (req, res) => {
  try {
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send({
          success: false,
          message: 'Error uploading file',
          error: err.message,
        });
      }

      const { username, name, email, password, contact, address, age, preference } = req.body;
      const resumeFile = req.file;
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

      // Upload resume to Firebase Storage
      const resumeBucket = storage.bucket(process.env.mentorStorageBucket);
      const resumeFileName = `${username}_resume.pdf`;

      const file = resumeBucket.file(resumeFileName);

      const resumeBuffer = resumeFile.buffer;
      const [fileUploadResponse] = await file.save(resumeBuffer, {
        metadata: {
          contentType: resumeFile.mimetype,
        },
      });

      // Check if the file upload was successful
      if (!fileUploadResponse) {
        return res.status(500).send({
          success: false,
          message: 'Error uploading resume',
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
        resume: `https://storage.googleapis.com/${process.env.mentorStorageBucket}/${resumeFileName}`,
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

      return res.status(201).send({
        success: true,
        message: 'User registered successfully',
        user: userJson,
      });
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
