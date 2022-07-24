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

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const id = req.params.id;
  const comments = commentsByPostId[id] || [];

  res.send(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = req.params.id;
  const commentId = randomBytes(4).toString('hex');
  const { body } = req;
  const { content } = body;

  const comments = commentsByPostId[id] || [];

  comments.push({
    id: commentId,
    content,
    status: 'pending',
  });

  commentsByPostId[id] = comments;

  await axios.post(
    `http://${EVENT_BUS_SERVICE_HOST}:${EVENT_BUS_SERVICE_PORT}/events`,
    {
      type: 'CommentCreated',
      data: {
        id: commentId,
        postId: id,
        content,
        status: 'pending',
      },
    }
  );

  res.status(201).send(commentsByPostId[id]);
});

app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post(
      `http://${EVENT_BUS_SERVICE_HOST}:${EVENT_BUS_SERVICE_PORT}/events`,
      {
        type: 'CommentUpdated',
        data: {
          id,
          postId,
          status,
          content,
        },
      }
    );
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
