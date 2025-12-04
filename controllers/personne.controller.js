import Personne from "../models/personne.model.js"
import personneValidation from "../validations/personne.validation.js"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url"
import Picture from "../models/picture.model.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const createPersonne = async(req,res)=>{
    try {
        console.log(req.body)
        if(!req.body){
            if(req.file){fs.unlinkSync(`./uploads/${req.file.filename}`)}
            return res.status(400).json({message: "no data in the request"})
        }
        const body = {...req.body}
        for (const key in body) {
            if (Object.hasOwnProperty.call(body, key)) {
                if (body[key] === "") body[key] = null;
            }
        }
        console.log(body)
        if(req.file){
            body.image = req.file.filename
        }

        if (body.genre !== null && body.genre !== undefined) {
            body.genre = body.genre === "male" ? false : true;
        }
        
        const {error} = personneValidation(body).personneCreate
        if(error){
            if(req.file){fs.unlinkSync(`./uploads/${req.file.filename}`)}
            return res.status(401).json(error.details[0].message)
        }
        const personne = new Personne(body)
        const newPersonne = await personne.save()
        return res.status(201).json(newPersonne)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllPersonnes = async(req, res) => {
    try {
        const personnes = await Personne.find().sort({nom: 1})
        let nodes = []
        for(let personne of personnes){
            nodes.push({
                id: personne._id,
                nom: personne.nom,
                prenom: personne.prenom,
                gender: personne.genre  ,
                naissance: personne.naissance,
                lieuNaissance: personne.lieuNaissance,
                deces: personne.deces,
                lieuDeces: personne.lieuDeces,
                mid: personne.mid,
                fid: personne.fid,
                pids: personne.pids,
                image: personne.image ? "https://genealog-back.onrender.com/uploads/"+personne.image : null
            })
        }
        return res.status(200).json(nodes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getPersonneById = async(req,res) => {
    try {
        const personne = await Personne.findById(req.params.id)
        if(!personne){
            return res.status(404).json({message: "personne doesn't exist"})
        }
        return res.status(200).json(personne)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updatePersonne = async(req,res) => {
    try {
        if(!req.body){
            if(req.file){fs.unlinkSync(`./uploads/${req.file.filename}`)}
            return res.status(400).json({message: "No data in the request"})
        }
        const body = {...req.body}
        for (const key in body) {
            if (Object.hasOwnProperty.call(body, key)) {
                if (body[key] === "") body[key] = null;
            }
        }
        console.log(body)

        const personne = await Personne.findById(req.params.id)
        if(!personne){
            if(req.file){fs.unlinkSync(`./uploads/${req.file.filename}`)}
            return res.status(404).json({message: "personne doesn't exist"})
        }
        
        if (body.genre !== null && body.genre !== undefined) {
            body.genre = body.genre === "male" ? false : true;
        }
        
        if(req.file){
            if(personne.image){
                const imagePath = path.join('./uploads/', personne.image)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }
            body.image = req.file.filename
        }
        const {error} = personneValidation(body).personneUpdate
        if(error){
            if(req.file){fs.unlinkSync(`./uploads/${req.file.filename}`)}
            return res.status(401).json(error.details[0].message)
        }
        const updatedPersonne = await Personne.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedPersonne){
            res.status(404).json({message: "personne doesn't exist"})
        }
        return res.status(200).json(updatedPersonne)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deletePersonne = async(req, res) => {
    try {
        
        const personne = await Personne.findById(req.params.id)
        if(!personne){
            return res.status(404).json({message: "personne doesn't exist"})
        }
        if(personne.pids.length > 0){
            for(let spouseId of personne.pids){
                const spouse = await Personne.findById(spouseId)
                if(spouse){
                    spouse.pids = spouse.pids.filter(pid => pid.toString() !== personne._id.toString())
                    await spouse.save()
                }
            }
        }
        let children = await Personne.find({$or: [{mid: personne._id}, {fid: personne._id}]})
        for(let child of children){
            if(child.mid && child.mid.toString() === personne._id.toString()){
                child.mid = null
            }
            if(child.fid && child.fid.toString() === personne._id.toString()){
                child.fid = null
            }
            await child.save()
        }
        let pictures = await Picture.find({membre: req.params.id})
        if(pictures.length>0){
            for(let pic of pictures){
                const oldPath = path.join(__dirname, '../uploads/', pic.image)
                if(fs.existsSync(oldPath)) {fs.unlinkSync(oldPath)}
                await pic.deleteOne()
            }
        }

        if (personne.image) {
            const imagePath = path.join('./uploads/', personne.image)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }
        await Personne.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "personne has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const createMariage = async(req, res) => {
    try {
        const personne1 = await Personne.findById(req.params.id1)
        const personne2 = await Personne.findById(req.params.id2)

        if(!personne1 || !personne2){
            return res.status(404).json({message: "One or both personnes don't exist"})
        }
        if(personne1.pids.includes(personne2._id) || personne2.pids.includes(personne1._id)){
            return res.status(400).json({message: "These personnes are already married"})
        }
        personne1.pids.push(personne2._id)
        personne2.pids.push(personne1._id)

        await personne1.save()
        await personne2.save()

        return res.status(200).json({message: "Marriage created successfully"})
        
    } catch (error) {
        
    }}

export { createPersonne, getAllPersonnes, getPersonneById, updatePersonne, deletePersonne, createMariage }