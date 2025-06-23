import { Router } from "express"
import { changePassword, deleteUser, getCurrentUser, getUserInfo, logout, login, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register")
    .post(
        upload.fields([{ name: "avatar" }]),
        registerUser
    )

router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-password").post(verifyJWT, changePassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-details").post(verifyJWT, updateAccountDetails)
router.route("/update-avatar").post(upload.fields([{ name: "avatar" }]), updateUserAvatar)
router.route("/delete-user").post(verifyJWT, deleteUser)
router.route("/getUserInfo/:id").get(verifyJWT,getUserInfo)
export default router;    