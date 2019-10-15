import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';

const router = Router();

const app = express();

app.use(bodyParser.json());

app.get('/',(req,res) => {
   return res.status(200).json({
       success: "true",
       message:"Hello Aphrodis! This is the start"
   })
})

app.listen(4000,() => {
    console.log(`app is listening to port 4000`);
})

module.exports = app;