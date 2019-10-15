import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
const app = express();

app.use(bodyParser.json());
app.use('/', routes);

app.listen(4000,() => {
    console.log(`app is listening to port 4000`);
})

module.exports = app;