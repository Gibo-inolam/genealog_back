
import User from "../models/user.model.js"
import userValidation from "../validations/user.validation.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async(req,res)=>{
    try {
        const {body} = req
        console.log(body)
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }
        const {error} = userValidation(body.newUser).userCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const searchUser = await User.findOne({pseudo: body.newUser.pseudo})
        if(searchUser){
            return res.status(401).json({message: "user already exists"})
        }
        const user = new User(body.newUser)
        const newUser = await user.save()
        return res.status(201).json(newUser)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const login = async(req, res) => {
    try {
        const {pseudo, password } = req.body
        const { error } = userValidation(req.body).userLogin
    
        if(error){
            return res.status(401).json(error.details[0].message)
        }

        const user = await User.findOne({ pseudo: pseudo})
        if(!user){
            return res.status(400).json({message: "invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "invalid invalides"})
        }
        res.status(200).json({
            message: user.email+" is connected",
            token: jwt.sign({ id: user._id, pseudo:  user.pseudo, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "12h" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getUserById = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateUser = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = userValidation(body.updatedUser).userUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, body.updatedUser, {new: true})
        if(!updatedUser){
            res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json({message: "user a été supprimé"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { register, login, getAllUsers, getUserById, updateUser, deleteUser }