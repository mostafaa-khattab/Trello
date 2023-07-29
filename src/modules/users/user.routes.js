import express from 'express'
import * as userController from './controller/user.controller.js'
import { auth } from '../../middleware/auth.js'

const userRouter = express.Router()

// 1-signUp 
userRouter.post('/signUp', userController.signUp)

// verify email
userRouter.get('/verify/:token', userController.verifyEmail)

// reset password
userRouter.post('/requestCode', userController.sendCode)

// forget password
userRouter.post('/forgetPassword', userController.forgetPassword)

// 2-login-->with create token
userRouter.post('/signIn', userController.signIn)

// 3-change password (user must be logged in)
userRouter.put('/passChange', auth, userController.changePassword)

// 4-update user (age , firstName , lastName)(user must be logged in)
userRouter.put('/update', auth, userController.updateUser)

// 5-delete user(user must be logged in)
userRouter.delete('/delete', auth, userController.deleteUser)

// 6-soft delete(user must be logged in)
userRouter.put('/softDelete', auth, userController.softDeleteUser)

// 7-logout
userRouter.post('/logout', auth, userController.logout)



export default userRouter