require('dotenv').config(); // Load environment variables

const { Probot } = require('probot');
const { exec } = require('child_process');

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY;
const webhookSecret = process.env.WEBHOOK_SECRET;

module.exports = (app) => {
  app.on('pull_request.opened', async (context) => {
    const { number, head } = context.payload.pull_request;
    const branch = head.ref;

    exec(`./deploy.sh ${number} ${branch}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    const issueComment = context.issue({ body: 'Deployment started. Check back soon for the status.' });
    return context.github.issues.createComment(issueComment);
  });

  app.on('pull_request.synchronize', async (context) => {
    const { number, head } = context.payload.pull_request;
    const branch = head.ref;

    exec(`./deploy.sh ${number} ${branch}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    const issueComment = context.issue({ body: 'Deployment updated with new commits.' });
    return context.github.issues.createComment(issueComment);
  });

  app.on('pull_request.closed', async (context) => {
    const { number } = context.payload.pull_request;

    exec(`./cleanup.sh ${number}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    const issueComment = context.issue({ body: 'Deployment cleaned up.' });
    return context.github.issues.createComment(issueComment);
  });
};

// Initialize Probot with GitHub App credentials
const probot = new Probot({
  id: appId,
  privateKey: privateKey,
  secret: webhookSecret,
});

probot.load(require('./index'));

module.exports = probot;
