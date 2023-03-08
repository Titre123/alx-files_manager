import express from "express";
import router from "./routes/index";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(process.env.PORT || 5000, 'localhost');
