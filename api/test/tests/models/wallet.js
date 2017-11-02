const { expect } = require('chai');
const { describe, it } = require('mocha');
const { User, Wallet } = require('../../helpers/db');

describe('wallet model', () => {
  it('should be able to create the table', done => {
    Wallet.sync({ force: true }).then(() => done())
  });

  it('should be able to create a wallet with a user', done => {
    User.create({
      username: 'Test',
      password: 'Test'
    })
    .then(user => Wallet.create({
      name: 'Bitcoin wallet',
      address: 'some address',
      local: false,
      UserId: user.id
    }))
    .then(wallet => {
      expect(wallet.address).to.equal('some address');
      expect(wallet.name).to.equal('Bitcoin wallet');
      expect(wallet.local).to.be.false;
      return wallet.getUser();
    })
    .then(user => {
      expect(user.username).to.equal('Test');
      return user.getWallets();
    })
    .then(([wallet]) => {
      expect(wallet.address).to.equal('some address');
      done();
    })
  });
});