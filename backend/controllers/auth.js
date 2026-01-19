import express from "express";
const router = express.Router();
import {
    handleSignUp,
    handleRefreshToken,
    handleSignIn,
    handleSignOut
} from "../handlers/auth.js";

router.post("/signup", handleSignUp);
router.post("/signin", handleSignIn);
router.get("/signout", handleSignOut);
router.get("/refresh", handleRefreshToken);

export default router;