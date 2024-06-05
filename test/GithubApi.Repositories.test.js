// import { StatusCodes } from 'http-status-codes';
import { expect, assert } from 'chai';
import get from 'axios';
import md5 from 'md5';

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const nameOfUser = 'Alejandro Perdomo';
const company = 'Perficient Latam';
const location = 'Colombia';
const repoToVerify = 'jasmine-json-report';

describe('Github Api Test', () => {
  describe('Get data from git hub', () => {
    let dataUser;
    before(async () => {
      const response = await get(`${urlBase}/users/${githubUserName}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response.data;
    });

    it('Verify data of the user', async () => {
      expect(dataUser.name).equal(nameOfUser);
      expect(dataUser.company).equal(company);
      expect(dataUser.location).equal(location);
    });

    it('Verify specific repo of the user', async () => {
      const response = await get(dataUser.repos_url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      const repositories = response.data;
      const repository = repositories.find((repo) => repo.name === repoToVerify);
      assert.exists(repository);
      expect(repository.full_name).to.equal('aperdomob/jasmine-json-report');
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('A Simple Jasmine JSON Report');
    });

    it('Verify repo is downloaded in zip format', async () => {
      const noExpectedMd5 = '62b254a4ef680d62d6de3489e462ad43';
      const response = await get(dataUser.repos_url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      const repositories = response.data;
      const repository = repositories.find((repo) => repo.name === repoToVerify);

      const responseFile = await get(`${repository.svn_url}/archive/refs/heads/${repository.default_branch}.zip`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      assert.exists(responseFile);
      expect(md5(responseFile.data)).to.equal(noExpectedMd5);
    });
  });

  describe('Get README file to verify', () => {
    let responseFileData;
    const readmeName = 'README.md';
    const readmePath = 'README.md';
    const readmeSha = '360eee6c223cee31e2a59632a2bb9e710a52cdc0';
    before(async () => {
      const response = await get(`${urlBase}/users/${githubUserName}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      const responseRepos = await get(response.data.repos_url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      const repositories = responseRepos.data;
      const repositoryData = repositories.find((repo) => repo.name === repoToVerify);

      const responseFile = await get(`${repositoryData.url}/contents`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      responseFileData = responseFile.data;
    });

    it('Verify README.md data', async () => {
      const readmeData = responseFileData.find((files) => files.name === readmeName);
      expect(readmeData.name).to.equal(readmeName);
      expect(readmeData.path).to.equal(readmePath);
      expect(readmeData.sha).to.equal(readmeSha);
    });

    it('Download README.md file', async () => {
      const readmeMD5 = '497eb689648cbbda472b16baaee45731';
      const repositoryData = responseFileData.find((repo) => repo.name === readmeName);
      const responseReadme = await get(repositoryData.download_url, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      assert.exists(responseReadme);
      expect(md5(responseReadme.data)).to.equal(readmeMD5);
    });
  });
});
