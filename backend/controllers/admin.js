import express from "express";
const router = express.Router();
import { isAdmin } from "./../middlewares/admin.js";
import {
    handleGetDashbord,
    handleLeaveStatus,
    handleEmployeesData,
    handleGetAttendance
} from "./../handlers/admin.js"

router.get("/dashboard", isAdmin, handleGetDashbord);
router.get("/leaveStatus", isAdmin, handleLeaveStatus);
router.get("/employees", isAdmin, handleEmployeesData);
router.get("/attendance", isAdmin, handleGetAttendance);

export default router;