// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTToken
 * @dev ERC721 NFT collection for the NodeMeta marketplace on BNB Smart Chain Testnet.
 */
contract NFTToken is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    mapping(uint256 => address) private _creators;

    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);

    constructor() ERC721("NodeMeta NFT", "NMNFT") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory uri) public returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId += 1;

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);
        _creators[newTokenId] = msg.sender;

        emit NFTMinted(newTokenId, msg.sender, uri);

        return newTokenId;
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        _requireOwned(tokenId);
        return _creators[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
