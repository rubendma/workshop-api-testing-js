import axios from 'axios';
import { expect, assert } from 'chai';

const urlBase = 'https://api.github.com';

describe('Delete request', () => {
  describe('Review creation of gist by post', () => {
    let createGist;
    let gistDataResult;
    let urlGist;
    let idGist;
    const descGist = `Gist created by API ${Date.now()}`;
    const gistData = {
      description: descGist,
      public: true,
      files: {
        'promesaFileTest.js': {
          content: 'This is a gist example'
        }
      }
    };

    before(async () => {
      createGist = await axios.post(`${urlBase}/gists`, gistData, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      gistDataResult = createGist.data;
      urlGist = gistDataResult.html_url;
      idGist = gistDataResult.id;
    });

    it('Verify gist creation', async () => {
      expect(createGist.status).to.equal(201);
      expect(createGist.statusText).to.equal('Created');
      expect(gistDataResult.public).to.equal(true);
      expect(gistDataResult.description).to.equal(gistData.description);
      expect(gistDataResult.files['promesaFileTest.js'].content).to.equal(gistData.files['promesaFileTest.js'].content);
    });

    it('Search gist', async () => {
      const dataGist = await axios.get(urlGist, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      expect(dataGist.status).to.equal(200);
      assert.exists(dataGist);
    });

    it('Delete gist', async () => {
      const deleteGist = await axios.delete(`${urlBase}/gists/${idGist}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      expect(deleteGist.status).to.equal(204);
      const dataGist = await axios.get(`${urlBase}/users/rubendma/gists`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
      const gistResults = dataGist.data;
      const gistResponse = gistResults.find((gist) => gist.id === idGist);
      expect(gistResponse).to.equal(undefined);
    });
  });
});
