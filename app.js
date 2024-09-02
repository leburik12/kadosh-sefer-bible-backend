const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
const express = require('express');
const logger = require('./config/logger.js');
const userRoute = require('./routes/UserRouter.js');
const errorHandler = require('./Middelwares/errorHandler.js');

if (cluster.isMaster) {
    const numCpus = os.cpus().length;
    logger.info(`Master ${process.pid} is running`);

    for (let i=0; i<numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker,code,signal) => {
        logger.info(`Worker ${worker.process.pid} died`);
        logger.info(`Worker ${worker.process.pid} died`);
        if (signal) {
            logger.info(`worker was killed by signal: ${signal}`);
        } else if (code !== 0) {   
             logger.info(`worker was exited with error code: ${code}`);
        } else {
             logger.info(`worker success`);
        }
        logger.info(`Starting a new worker`);
        cluster.fork();
    });
} else {
    const port = process.env.PORT || 3000
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use((req,res,next) => {
        logger.info({method: req.method, url: req.url})
        next()
    })

    app.use('/users/',userRoute);
    app.use(errorHandler);


    const startServer = () => {
        app.listen(port, () => {
            console.log(`Server is running in port ${port}`)
        })
    }

    startServer()
}