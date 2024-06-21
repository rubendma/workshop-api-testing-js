import { expect } from 'chai';
import axios from 'axios';

const urlBase = 'https://github.com/aperdomob/redirect-test';
const urlRedirect = 'https://github.com/aperdomob/new-redirect-test';

describe('HEAD requests', () => {
  let dataUser;
  describe('Review HEAD request', () => {
    before(async () => {
      const response = await axios.head(urlBase, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response;
    });

    it('Verify redirect url and status', async () => {
      expect(dataUser.status).to.equal(200);
      expect(dataUser.request.res.responseUrl).to.equal(urlRedirect);
    });
  });

  describe('Review HEAD redirect request', () => {
    before(async () => {
      const response = await axios.get(urlBase, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      dataUser = response;
    });

    it('Verify redirection', async () => {
      expect(dataUser.status).to.equal(200);
      expect(dataUser.request.res.responseUrl).to.equal(urlRedirect);
    });
  });
});
