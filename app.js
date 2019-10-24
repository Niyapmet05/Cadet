import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
const app = express();

app.use(bodyParser.json());
app.use('/', routes);

app.listen(4000,() => {
    console.log(`app is listening to port 4000`);
})

/*const app = express();
const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello World</h1>');
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
});
*/
module.exports = app;
// export default app;