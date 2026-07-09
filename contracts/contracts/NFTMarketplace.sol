// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTToken.sol";

/**
 * @title NFTMarketplace
 * @dev NFT marketplace for buying and selling on BNB Smart Chain Testnet.
 */
contract NFTMarketplace is ReentrancyGuard, Pausable, Ownable {
    NFTToken public nftToken;

    uint256 public marketplaceFee = 250;
    uint256 public constant BASIS_POINTS = 10000;

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
        uint256 listingId;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) public listingIdToTokenId;

    uint256 private _listingIdCounter;

    event NFTListed(uint256 indexed tokenId, uint256 indexed listingId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, uint256 indexed listingId, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, uint256 indexed listingId, address indexed seller);
    event MarketplaceFeeUpdated(uint256 newFee);

    constructor(address _nftTokenAddress) Ownable(msg.sender) {
        nftToken = NFTToken(_nftTokenAddress);
        _listingIdCounter = 1;
    }

    function listNFT(uint256 tokenId, uint256 price) external whenNotPaused nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(nftToken.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(
            nftToken.getApproved(tokenId) == address(this) ||
                nftToken.isApprovedForAll(msg.sender, address(this)),
            "NFT not approved for marketplace"
        );
        require(!listings[tokenId].isActive, "NFT already listed");

        uint256 listingId = _listingIdCounter;
        _listingIdCounter += 1;

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isActive: true,
            listingId: listingId
        });

        listingIdToTokenId[listingId] = tokenId;

        emit NFTListed(tokenId, listingId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) external payable whenNotPaused nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "NFT not listed for sale");
        require(msg.value == listing.price, "Incorrect price");
        require(msg.sender != listing.seller, "Seller cannot buy their own NFT");

        address seller = listing.seller;
        uint256 listingId = listing.listingId;

        uint256 marketplaceFeeAmount = (listing.price * marketplaceFee) / BASIS_POINTS;
        uint256 sellerAmount = listing.price - marketplaceFeeAmount;

        nftToken.safeTransferFrom(seller, msg.sender, tokenId);

        payable(seller).transfer(sellerAmount);
        payable(owner()).transfer(marketplaceFeeAmount);

        delete listings[tokenId];
        delete listingIdToTokenId[listingId];

        emit NFTSold(tokenId, listingId, msg.sender, listing.price);
    }

    function cancelListing(uint256 tokenId) external whenNotPaused nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        uint256 listingId = listing.listingId;

        delete listings[tokenId];
        delete listingIdToTokenId[listingId];

        emit ListingCancelled(tokenId, listingId, msg.sender);
    }

    function getListing(uint256 tokenId)
        external
        view
        returns (address seller, uint256 price, bool isActive, uint256 listingId)
    {
        Listing storage listing = listings[tokenId];
        return (listing.seller, listing.price, listing.isActive, listing.listingId);
    }

    function isListed(uint256 tokenId) external view returns (bool) {
        return listings[tokenId].isActive;
    }

    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(newFee);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }

    function getTotalListings() external view returns (uint256) {
        return _listingIdCounter - 1;
    }
}
