import express from 'express';
import {
    menteesLoginController,
    menteesRegisterController, mentorsLoginController, mentorsRegisterController,
} from '../controllers/authController.js';


// import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



//route object
const router = express.Router();

//routing
//Register || POST
router.post('/register/mentees', menteesRegisterController);
router.post('/register/mentors', mentorsRegisterController);

//Login || POST
router.post('/login/mentees', menteesLoginController);
router.post('/login/mentors', mentorsLoginController);


export default router;