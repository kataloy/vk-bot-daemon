require('custom-env').env(process.env.NODE_ENV);

const path = require('path');
const fs = require('fs');

const {NODE_ENV} = process.env;

const message = fs.readFileSync(
  path.resolve('config', 'messages', `${NODE_ENV || 'default'}.txt`),
  'utf8'
);

let targets = [];

for (const [key, value] of Object.entries(process.env)) {
  if (!key.includes('TARGET_')) continue;

  const index = key.substring(key.length - 1) - 1;

  if (!targets[index]) {
    targets[index] = {};
  }

  if (key.includes('NAME')) targets[index].name = value;
  if (key.includes('GROUP')) targets[index].groupId = +value;
  if (key.includes('TOPIC')) targets[index].topicId = +value;
}

const vk = {
  accessToken: process.env.TOKEN,
  id: +process.env.ID,
};

module.exports = {
  message,
  targets,
  vk,
};