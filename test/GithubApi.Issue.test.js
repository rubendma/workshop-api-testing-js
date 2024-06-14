import { expect } from 'chai';
import axios from 'axios';

const urlBase = 'https://api.github.com';
const repositoryName = 'workshop-api-testing-js';

describe('Post and Patch requests', () => {
  describe('Review creation of issue by post', () => {
    let dataUser;
    let urlIssue;
    let issueNumber;
    let issueTitle;
    before(async () => {
      const response = await axios.get(`${urlBase}/user`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response.data;
      urlIssue = `${urlBase}/repos/${dataUser.login}/${repositoryName}/issues`;
    });

    it('Verify exist at least one public repository', async () => {
      const repositories = await axios.get(dataUser.repos_url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      const dataRepositories = repositories.data;
      const repository = dataRepositories.find((repo) => repo.private === false);
      expect(repository.name).to.not.equal(undefined);
    });

    it('Verify issue creation', async () => {
      const timeStamp = Date.now();
      const issueData = { title: `Issue created from api ${timeStamp}` };
      const createIssue = await axios.post(urlIssue, issueData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      issueNumber = createIssue.data.number;
      issueTitle = issueData.title;
      expect(createIssue.status).to.equal(201);
      expect(createIssue.statusText).to.equal('Created');
      expect(issueNumber).to.not.equal(undefined);
      expect(createIssue.data.title).to.equal(issueTitle);
      expect(createIssue.data.body).to.equal(null);
    });

    it('Verify issue update', async () => {
      const dataIssueUpdate = { body: 'Body added to review issue' };
      const updateIssue = await axios.patch(`${urlIssue}/${issueNumber}`, dataIssueUpdate, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      expect(updateIssue.status).to.equal(200);
      expect(updateIssue.statusText).to.equal('OK');
      expect(updateIssue.data.number).to.equal(issueNumber);
      expect(updateIssue.data.title).to.equal(issueTitle);
      expect(updateIssue.data.body).to.equal(dataIssueUpdate.body);
    });
  });
});
