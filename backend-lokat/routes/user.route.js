import { Router } from "express"
import { deleteAccessController, getCurrentUser, getOthersLocationController, grantAccessController, loginUser, logoutUser, registerUser, resendOTP, updateLocationController, verifyOTP, whoCanSeeMeController } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.get("/profile", verifyJWT, getCurrentUser)
router.post("/verify", verifyOTP)
router.post("/resend", resendOTP)
router.post("/grant-access",verifyJWT,grantAccessController)
router.post("/others",verifyJWT,getOthersLocationController)
router.post("/viewers",verifyJWT,whoCanSeeMeController)
router.post("/update/location",verifyJWT,updateLocationController)
router.post("/delete-access",verifyJWT,deleteAccessController)

export default router