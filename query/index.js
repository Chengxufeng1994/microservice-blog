const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const EVENT_BUS_SERVICE_HOST = process.env.EVENT_BUS_SERVICE_HOST;
const EVENT_BUS_SERVICE_PORT = process.env.EVENT_BUS_SERVICE_PORT;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comments = post.comments || [];
    comments.push({ id, content, status });

    post.comments = comments;
    posts[postId] = post;
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comments = post.comments;
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { body } = req;
  const { type, data } = body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');
  const res = await axios.get(
    `http://${EVENT_BUS_SERVICE_HOST}:${EVENT_BUS_SERVICE_PORT}/events`
  );
  for (let evt of res.data) {
    console.log('Processing event: ', evt.type);
    handleEvent(evt.type, evt.data);
  }
});
