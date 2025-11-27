import 'dotenv/config';
import express from 'express';
import db from "./db/db.js"
import cors from 'cors';
import personneRoutes from './routes/personne.route.js';
import userRoutes from './routes/user.route.js'



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
