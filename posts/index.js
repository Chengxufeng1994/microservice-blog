const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

const EVENT_BUS_SERVICE_HOST = process.env.EVENT_BUS_SERVICE_HOST;
const EVENT_BUS_SERVICE_PORT = process.env.EVENT_BUS_SERVICE_PORT;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { body } = req;
  const { title } = body;

  posts[id] = {
    id,
    title,
  };

  await axios.post(`http://${EVENT_BUS_SERVICE_HOST}:${EVENT_BUS_SERVICE_PORT}/events`, {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on 4000');
});
