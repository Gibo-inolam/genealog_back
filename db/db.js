import mongoose from "mongoose";

export default async function db() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connexion MongoDB réussie !");
    } catch (error) {
        console.error("Erreur de connexion MongoDB :", error);
        process.exit(1);
    }
}
