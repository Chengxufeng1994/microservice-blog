const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const EVENT_BUS_SERVICE_HOST = process.env.EVENT_BUS_SERVICE_HOST;
const EVENT_BUS_SERVICE_PORT = process.env.EVENT_BUS_SERVICE_PORT;

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { body } = req;
  const { type, data } = body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post(
      `http://${EVENT_BUS_SERVICE_HOST}:${EVENT_BUS_SERVICE_PORT}/events`,
      {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      }
    );
  }

  res.send();
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
