
import Picture from "../models/picture.model.js"
import pictureValidation from "../validations/picture.validation.js"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createPicture = async(req,res)=>{
    try {
        console.log(req.body)
        if(!req.body){
            if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
            return res.status(400).json({message: "No data in the request"})
        }
        const body = {...req.body}
        if(req.file){
            body.image = req.file.filename
        }
        console.log(body)
        const {error} = pictureValidation(body).pictureCreate
        if(error){
            if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
            return res.status(401).json(error.details[0].message)
        }
        const picture = new Picture(body)
        const newPicture = await picture.save()
        return res.status(201).json(newPicture)        
    } catch (error) {
        console.log(error)
        if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllPictures = async(req, res) => {
    try {
        const pictures = await Picture.find()
        return res.status(200).json(pictures)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getPicturesByMembreId = async(req,res) => {
    try {
        const pictures = await Picture.find({membre: req.params.id})
        return res.status(200).json(pictures)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deletePicture = async(req, res) => {
    try {
        const picture = await Picture.findById(req.params.id)
        if(!picture){
            return res.status(404).json({message: "picture doesn't exist"})
        }
        if(picture.image){
            const oldPath = path.join(__dirname, '../uploads/', picture.image)
            if(fs.existsSync(oldPath)) {fs.unlinkSync(oldPath)}
        }
        await picture.deleteOne()
        return res.status(200).json({message: "picture has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createPicture, getAllPictures, getPicturesByMembreId, deletePicture }