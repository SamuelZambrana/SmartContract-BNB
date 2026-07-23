const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {
    let nftToken, rewardToken, staking;
    let owner, addr1, addr2;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy NFT
        const NFTToken = await ethers.getContractFactory("NFTToken");
        nftToken = await NFTToken.deploy();
        await nftToken.waitForDeployment();

        // Deploy Reward Token
        const RewardToken = await ethers.getContractFactory("RewardToken");
        rewardToken = await RewardToken.deploy();
        await rewardToken.waitForDeployment();

        // Deploy Staking
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(
            await nftToken.getAddress(),
            await rewardToken.getAddress()
        );
        await staking.waitForDeployment();

        // Mint NFT to addr1 (correct function for your NFTToken)
        await nftToken.connect(owner).safeMint(addr1.address);
    });

    it("should allow NFT owner to stake their token", async () => {
        await nftToken.connect(addr1).approve(await staking.getAddress(), 1);
        await staking.connect(addr1).stake(1);

        expect(await staking.stakers(1)).to.equal(addr1.address);
        expect(await nftToken.ownerOf(1)).to.equal(await staking.getAddress());
    });

    it("should reject staking by non-owner", async () => {
        await nftToken.connect(addr1).approve(await staking.getAddress(), 1);

        await expect(
            staking.connect(addr2).stake(1)
        ).to.be.revertedWith("Not NFT owner");
    });

    it("should return correct pending rewards after 1 day", async () => {
        await nftToken.connect(addr1).approve(await staking.getAddress(), 1);
        await staking.connect(addr1).stake(1);

        // Fast-forward 1 day
        await ethers.provider.send("evm_increaseTime", [86400]);
        await ethers.provider.send("evm_mine");

        const pending = await staking.pendingRewards(1);

        // 10 NTE per day → 10e18
        expect(pending).to.be.closeTo(
            ethers.parseEther("10"),
            ethers.parseEther("0.01")
        );
    });

    it("should allow unstaking and return NFT + rewards", async () => {
        await nftToken.connect(addr1).approve(await staking.getAddress(), 1);
        await staking.connect(addr1).stake(1);

        // Fast-forward 1 day
        await ethers.provider.send("evm_increaseTime", [86400]);
        await ethers.provider.send("evm_mine");

        await staking.connect(addr1).unstake(1);

        // NFT returned
        expect(await nftToken.ownerOf(1)).to.equal(addr1.address);

        // Rewards minted
        const balance = await rewardToken.balanceOf(addr1.address);
        expect(balance).to.be.closeTo(
            ethers.parseEther("10"),
            ethers.parseEther("0.01")
        );
    });
});
