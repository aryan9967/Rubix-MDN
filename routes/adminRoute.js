import express from 'express';
import {
    approveMentorController,
    unapprovedMentorsController
} from '../controllers/adminController.js';


// import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



//route object
const router = express.Router();

//routing
//Mentors || POST
router.post('/unapproved-mentors', unapprovedMentorsController);
router.post('/approve-mentor', approveMentorController);



export default router;