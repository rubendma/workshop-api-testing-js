import { expect } from 'chai';
import axios from 'axios';

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Put requests', () => {
  describe('Review follow an user', () => {
    let dataUser;
    before(async () => {
      const response = await axios.put(`${urlBase}/user/following/${githubUserName}`, null, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response;
    });

    it('Verify status ok', async () => {
      expect(dataUser.status).to.equal(204);
      expect(dataUser.statusText).to.equal('No Content');
    });
  });

  describe('Review user follows an other user', () => {
    let dataUser;
    before(async () => {
      const response = await axios.get(`${urlBase}/user/following`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response.data;
    });

    it('Verify users that follow the account', async () => {
      const userFollowed = dataUser.find((users) => users.login === githubUserName);
      expect(userFollowed.login).to.equal('aperdomob');
    });
  });
});
