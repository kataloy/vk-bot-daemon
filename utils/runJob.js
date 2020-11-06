const runJob = async (cb, interval) => {
  try {
    await cb();
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    runJob(cb, interval);
  }, interval);
};

module.exports = runJob;

