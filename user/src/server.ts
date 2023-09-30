import express, { Application, Router } from 'express';
import bodyParser from 'body-parser';
import router from '@/routes/user-router'

class Server {
    private app
    private port

    constructor() {
        this.port = process.env.SERVER_PORT
        this.app = express();
        this.configMiddleware();
        this.configRouter()
    }

    private configMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); 
    }

    private configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/user', router);
    }

    public start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port)
        })
    }
}

export default Server;