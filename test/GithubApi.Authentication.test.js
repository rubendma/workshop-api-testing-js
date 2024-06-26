import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';
import get from 'axios';

const urlBase = 'https://api.github.com';
const githubUserName = 'rubendma';
const repository = 'workshop-api-testing-js';

describe('Github Api Test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await get(`${urlBase}/repos/${githubUserName}/${repository}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.description).equal('This is a Workshop about Api Testing in JavaScript');
    });

    it('Via OAuth2 Tokens by parameter', async () => {
      const response = await get(
        `${urlBase}/repos/${githubUserName}/${repository}`,
        { access_token: process.env.ACCESS_TOKEN }
      );

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.description).equal('This is a Workshop about Api Testing in JavaScript');
    });
  });
});
