import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import 'dotenv/config'

import User from "../models/user.js"


export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) return res.status(StatusCodes.NOT_FOUND).json({ message: "User doesn't exist." })
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(StatusCodes.OK).json({ result: existingUser, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." })
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists." })
        if (password !== confirmPassword) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Passwords don't match" })

        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(StatusCodes.OK).json({ result, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." })
    }
}