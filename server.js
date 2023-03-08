import express from "express";
import router from "./routes/index";

// create express application
const app = express();

// Middleware for request body to be return in json
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// router routing to /
app.use('/', router);

// listening to port
app.listen(process.env.PORT || 5000, 'localhost', () => {console.log('server started')});
