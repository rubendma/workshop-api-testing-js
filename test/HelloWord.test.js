//const { assert } = require("chai");
import { assert } from 'chai';
//let assert = require('chai').assert
//import assert from "chai";
//import { expect} from "chai"


describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});