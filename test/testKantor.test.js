const WWTokenA = artifacts.require("WWTokenA");
const WWTokenB = artifacts.require("WWTokenB");
const Kantor = artifacts.require("Kantor");

contract("Exchange", (accounts) => {
  let wWTokenA;
  let wWTokenB;
  let kantor;
  let balance;

  describe("Kantor tests", async () => {

    before(async () => {
      wWTokenA = await WWTokenA.deployed();
      wWTokenB = await WWTokenB.deployed();
      kantor = await Kantor.deployed(wWTokenA.address, wWTokenB.address, 7);
    }); 

    it("token balance test", async () => {
      balance = await wWTokenA.balanceOf(accounts[0]);
      assert.equal(balance.toString(), "1000000000000000000000", "The balance for account[0] of wWTokenA should be 1000000000000000000000");
      balance = await wWTokenB.balanceOf(accounts[0]);
      assert.equal(balance.toString(), "1000000000000000000000", "The balance for account[0] of wWTokenB should be 1000000000000000000000");
      balance = await wWTokenA.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "0", "The balance for account[1] of wWTokenA should be 0");
      balance = await wWTokenB.balanceOf(kantor.address);
      assert.equal(balance.toString(), "0", "The balance for kantor of wWTokenB should be 0");
    });

    it("simple test", async () => {
      await wWTokenB.increaseAllowance(kantor.address, 100, {
        from: accounts[0],
      });
      await wWTokenA.increaseAllowance(accounts[1], 50, {
        from: accounts[0],
      });
      await kantor.deposit(wWTokenB.address, 100, { from: accounts[0], });
      await wWTokenA.transferFrom(accounts[0], accounts[1], 50, {
        from: accounts[1],
      });
      await wWTokenA.approve(kantor.address, 10, {
        from: accounts[1],
      });
      await kantor.exchange(wWTokenA.address, 10, {
        from: accounts[1],
      });
      
      balance = await wWTokenA.balanceOf(kantor.address);
      assert.equal(balance.toString(), "10", "The balance for kantor of wWTokenA should be 10");
      balance = await wWTokenB.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "70", "The balance for account[1] of wWTokenB should be 70");
    });

    it("updates price", async () => {
      await kantor.updatePrice(3);
      await wWTokenA.approve(kantor.address, 1, {
        from: accounts[1],
      });
      await kantor.exchange(wWTokenA.address, 1, {
        from: accounts[1],
      });
      
      balance = await wWTokenA.balanceOf(kantor.address);
      assert.equal(balance.toString(), "11", "The balance for kantor of wWTokenA should be 11");
      balance = await wWTokenB.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "73", "The balance for account[1] of wWTokenB should be 73");
    });

    it("has not enough tokens amount in deposit", async () => {
      await wWTokenA.approve(kantor.address, 10, {
        from: accounts[1],
      });
      try {
        await kantor.exchange(wWTokenA.address, 10, { from: accounts[1], });
      } catch (err) {
        assert.include( err.message, 'Tokens amount exceeded', 'Tokens amount exceeded error not catched' );
      }
    });

    it("calls deposit when allowance is not set", async () => {
      try {
        await kantor.deposit(wWTokenA.address, 100, { from: accounts[0], });
      } catch (err) {
        assert.include( err.message, 'transfer amount exceeds allowance', 'exceeded allowance error not catched' );
      }
    });

    it("calls deposit with not known address", async () => {
      try {
        await kantor.deposit(accounts[2], 0, { from: accounts[0], });
      } catch (err) {
        assert.include( err.message, 'address of the token should be known', 'not known address error not catched' );
      }
    });

    it ("exchange tokenB", async () => {
      await kantor.updatePrice(2);
      await wWTokenB.approve(kantor.address, 2, {
        from: accounts[1],
      });
      await kantor.exchange(wWTokenB.address, 2, {
        from: accounts[1],
      });
      balance = await wWTokenA.balanceOf(kantor.address);
      assert.equal(balance.toString(), "10", "The balance for kantor of wWTokenA should be 10");
      balance = await wWTokenB.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "71", "The balance for account[1] of wWTokenB should be 71");
    });
  });
});