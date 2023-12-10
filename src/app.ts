import express, { type Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import db from './models/index';
import authRouter from './routes/auth.routes';
import userRouter from "./routes/user.routes";
import session from 'express-session';

const app: Express = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key-here',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (_req, res) => {
    res.send('Welcome to the VirtuaYou UserAuth API.')
})

// database
const Role = db.role;

//if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync Db');
        initial();
    });
//} else {
//    db.sequelize.sync();
//}

// routes
app.use(authRouter);
app.use(userRouter);

// create reference role objects
function initial() {
    Role.create({
        id: 1,
        name: "owner",
    });

    Role.create({
        id: 2,
        name: "agent",
    });

    Role.create({
        id: 3,
        name: "monitor",
    });

    Role.create({
        id: 4,
        name: "admin",
    });
}

export default app;