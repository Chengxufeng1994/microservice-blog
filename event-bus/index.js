const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const POSTS_CLUSTERIP_SERVICE_HOST = process.env.POSTS_CLUSTERIP_SERVICE_HOST;
const POSTS_CLUSTERIP_SERVICE_PORT = process.env.POSTS_CLUSTERIP_SERVICE_PORT;

const COMMENTS_CLUSTERIP_SERVICE_HOST =
  process.env.COMMENTS_CLUSTERIP_SERVICE_HOST;
const COMMENTS_CLUSTERIP_SERVICE_PORT =
  process.env.COMMENTS_CLUSTERIP_SERVICE_PORT;

const MODERATION_CLUSTERIP_SERVICE_HOST =
  process.env.MODERATION_CLUSTERIP_SERVICE_HOST;
const MODERATION_CLUSTERIP_SERVICE_PORT =
  process.env.MODERATION_CLUSTERIP_SERVICE_PORT;

const QUERY_CLUSTERIP_SERVICE_HOST = process.env.QUERY_CLUSTERIP_SERVICE_HOST;
const QUERY_CLUSTERIP_SERVICE_PORT = process.env.QUERY_CLUSTERIP_SERVICE_PORT;

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios
    .post(
      `http://${POSTS_CLUSTERIP_SERVICE_HOST}:${POSTS_CLUSTERIP_SERVICE_PORT}/events`,
      event
    )
    .catch((err) => {
      console.log(err.message);
    });

  axios
    .post(
      `http://${COMMENTS_CLUSTERIP_SERVICE_HOST}:${COMMENTS_CLUSTERIP_SERVICE_PORT}/events`,
      event
    )
    .catch((err) => {
      console.log(err.message);
    });

  axios
    .post(
      `http://${MODERATION_CLUSTERIP_SERVICE_HOST}:${MODERATION_CLUSTERIP_SERVICE_PORT}/events`,
      event
    )
    .catch((err) => {
      console.log(err.message);
    });

  axios
    .post(
      `http://${QUERY_CLUSTERIP_SERVICE_HOST}:${QUERY_CLUSTERIP_SERVICE_PORT}/events`,
      event
    )
    .catch((err) => {
      console.log(err.message);
    });

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log(`http://${POSTS_CLUSTERIP_SERVICE_HOST}:${POSTS_CLUSTERIP_SERVICE_PORT}/events`)
  console.log(`http://${COMMENTS_CLUSTERIP_SERVICE_HOST}:${COMMENTS_CLUSTERIP_SERVICE_PORT}/events`)
  console.log(`http://${MODERATION_CLUSTERIP_SERVICE_HOST}:${MODERATION_CLUSTERIP_SERVICE_PORT}/events`)
  console.log(`http://${QUERY_CLUSTERIP_SERVICE_HOST}:${QUERY_CLUSTERIP_SERVICE_PORT}/events`);
  console.log('Listening on 4005');
});
