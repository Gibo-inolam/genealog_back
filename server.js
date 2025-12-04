import 'dotenv/config';
import express from 'express';
import db from "./db/db.js"
import cors from 'cors';
import personneRoutes from './routes/personne.route.js';
import userRoutes from './routes/user.route.js';
import pictureRoutes from './routes/picture.route.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json())


// Connexion à la BDD puis démarrage du serveur
db().then(() => {
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    });
});


// routes----------
app.use('/personne', personneRoutes);
app.use('/user', userRoutes);
app.use('/picture', pictureRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
