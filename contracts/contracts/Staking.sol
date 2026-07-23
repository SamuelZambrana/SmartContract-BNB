// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTToken.sol";
import "./RewardToken.sol";

/**
 * @title Staking
 * @dev Staking contract for NFTToken → rewards in RewardToken (NTE)
 */
contract Staking is ReentrancyGuard {
    NFTToken public nftToken;
    RewardToken public rewardToken;

    // Reward rate: 10 NTE per day, accrued per-second
    uint256 public constant REWARD_RATE_PER_SECOND = 1157407407407407;

    // tokenId → staker address
    mapping(uint256 => address) public stakers;

    // tokenId → timestamp when staking started
    mapping(uint256 => uint256) public stakeTimestamps;

    constructor(address _nftTokenAddress, address _rewardTokenAddress) {
        nftToken = NFTToken(_nftTokenAddress);
        rewardToken = RewardToken(_rewardTokenAddress);
    }

    /**
     * @notice Stake an NFT and start earning rewards
     */
    function stake(uint256 tokenId) external {
        require(nftToken.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(stakers[tokenId] == address(0), "Already staked");

        // Transfer NFT to this contract
        nftToken.transferFrom(msg.sender, address(this), tokenId);

        // Register staking
        stakers[tokenId] = msg.sender;
        stakeTimestamps[tokenId] = block.timestamp;
    }

    /**
     * @notice Unstake NFT and claim rewards
     */
    function unstake(uint256 tokenId) external nonReentrant {
        require(stakers[tokenId] == msg.sender, "Not staker");

        // Calculate pending rewards
        uint256 rewards = _calculateRewards(tokenId);

        // Clear staking data
        stakers[tokenId] = address(0);
        stakeTimestamps[tokenId] = 0;

        // Return NFT
        nftToken.transferFrom(address(this), msg.sender, tokenId);

        // Mint reward tokens
        rewardToken.mint(msg.sender, rewards);
    }

    /**
     * @notice View function: returns pending rewards for a staked token
     */
    function pendingRewards(uint256 tokenId) external view returns (uint256) {
        return _calculateRewards(tokenId);
    }

    /**
     * @dev Internal reward calculation
     */
    function _calculateRewards(uint256 tokenId) internal view returns (uint256) {
        if (stakers[tokenId] == address(0)) return 0;

        uint256 stakedAt = stakeTimestamps[tokenId];
        uint256 elapsed = block.timestamp - stakedAt;

        return elapsed * REWARD_RATE_PER_SECOND;
    }

    /**
     * @notice Nice-to-have: return staked tokens by owner
     * @dev NFTToken.sol does NOT implement totalSupply(), so we leave this safely stubbed.
     */
    function getStakedTokens(address owner) external view returns (uint256[] memory) {
        uint256[] memory empty;
        return empty;
    }
}
