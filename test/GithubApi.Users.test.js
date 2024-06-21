import { expect } from 'chai';
import axios from 'axios';

const urlBase = 'https://api.github.com';

describe('Query parameters request', () => {
  it('Verify defatult users quantity', async () => {
    const getUsers = await axios.get(`${urlBase}/users`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });
    expect(getUsers.status).to.equal(200);
    expect(getUsers.data.length).to.equal(30);
  });

  it('Verify response with 10 users', async () => {
    const getUsers = await axios.get(`${urlBase}/users?per_page=10`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });
    expect(getUsers.data.length).to.equal(10);
  });

  it('Verify response with 100 users', async () => {
    const getUsers = await axios.get(`${urlBase}/users?per_page=100`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });
    expect(getUsers.data.length).to.equal(100);
  });
});
