const config = require('./config/config');
const sleep = require('./utils/sleep');
const runJob = require('./utils/runJob');
const initApi = require('./utils/initApi');

const INTERVAL = 2 * 60 * 60 * 1000;

const api = initApi(config.vk.accessToken);

const getComments = async (groupId, topicId) => {
  const { items } = await api('board.getComments', {
    group_id: groupId,
    topic_id: topicId,
    count: 100,
    sort: 'desc',
  });

  return items.filter((item) => item.from_id === config.vk.id);
};

const deleteComments = async (groupId, topicId, comments) => {
  let result;

  for (const item of comments) {
    await sleep(1000);

    result = await api('board.deleteComment', {
      group_id: groupId,
      topic_id: topicId,
      comment_id: item.id,
    });
  }

  return result;
};

runJob(async () => {
  for (const { name, groupId, topicId } of config.targets) {
    await sleep(1000);

    const nowDate = Date.now();
    const comments = await getComments(groupId, topicId);
    const shouldWriteComment = !comments.find((item) => nowDate - item.date * 1000 < INTERVAL);

    if (!shouldWriteComment) {
      console.log(
        `Already published comment for group ${name} in ${topicId} topic`,
      );

      continue;
    }

    const deleteStatus = await deleteComments(groupId, topicId, comments);

    console.log(`Status of deleting comments: ${deleteStatus}`);

    const result = await api('board.createComment', {
      group_id: groupId,
      topic_id: topicId,
      message: config.message,
    });

    console.log(
      `Successfully published comment for group ${name} in ${topicId} topic`,
      result,
    );
  }
}, 1000 * 60 * 10);
