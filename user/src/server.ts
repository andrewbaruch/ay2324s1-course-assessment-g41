import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from '@/routes/user-router'
import authRouter from '@/routes/auth-router'

class Server {
    private app
    private port

    constructor() {
        const port = process.env.SERVER_PORT
        if (!port) {
            console.log("Missing SERVER_PORT")
            process.exit()
        }

        this.port = port
        this.app = express();
        this.configMiddleware();
        this.configRouter()
    }

    private configMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); 
       this.app.use(cors({
            origin: '*',
        }));

    }

    private configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/user', userRouter);
        this.app.use('/auth', authRouter);
    }

    public start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port)
        })
    }
}

export default Server;