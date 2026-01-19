import express from "express";
import {
    handleGetUserInfo,
    handleGetProfile,
    handleCheckIn,
    handleCheckOut,
    handleGetRemainingLeave,
    handleApplyLeave,
    handleGetLeaveHistory,
    handleCancelLeave,
    handleGetAttendance
} from "../handlers/user.js";

import { isUser } from "./../middlewares/user.js"
const router = express.Router();


router.get("/user-info", isUser, handleGetUserInfo);
router.get("/profile", isUser, handleGetProfile);
router.get("/checkin", isUser, handleCheckIn);
router.get("/checkout", isUser, handleCheckOut);
router.get("/remaining-leave", isUser, handleGetRemainingLeave);
router.get("/leave-history", isUser, handleGetLeaveHistory);
router.get("/attendance",isUser,handleGetAttendance);

router.post("/apply-leave", isUser, handleApplyLeave);
router.post("/cancel-leave", isUser, handleCancelLeave)

export default router;