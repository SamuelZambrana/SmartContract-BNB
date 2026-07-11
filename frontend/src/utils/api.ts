import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const PAYMENTS_URL = import.meta.env.VITE_PAYMENTS_URL || 'http://localhost:3003';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export interface NFT {
  id: number;
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  tokenUri?: string;
  owner: string;
  creator: string;
  price: string;
  isListed: boolean;
  listingId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Transaction {
  id: number;
  txHash: string;
  type: string;
  tokenId: number;
  from: string;
  to: string;
  price: string;
  blockNum: number;
  timestamp: number;
}

export interface NFTListResponse {
  nfts: NFT[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const apiService = {
  async getNFTs(page = 1, limit = 10): Promise<NFTListResponse> {
    const response = await api.get('/nfts', { params: { page, limit } });
    return response.data;
  },

  async getNFT(id: number): Promise<NFT> {
    const response = await api.get(`/nfts/${id}`);
    return response.data;
  },

  async getNFTMetadata(id: number): Promise<NFTMetadata> {
    const response = await api.get(`/nfts/${id}/metadata`);
    return response.data;
  },

  async getListedNFTs(): Promise<NFT[]> {
    const response = await api.get('/nfts/marketplace/listings');
    return response.data;
  },

  async getNFTHistory(id: number) {
    const response = await api.get(`/nfts/${id}/history`);
    return response.data;
  },

  async submitBid(id: number, bidder: string, amount: string) {
    const response = await api.post(`/nfts/${id}/bid`, { bidder, amount });
    return response.data;
  },

  async getTransactionsByUser(address: string, page = 1, limit = 10) {
    const response = await api.get(`/transactions/user/${address}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },

  async paymentsHealthCheck(): Promise<{ status: string; service: string }> {
    const response = await axios.get(`${PAYMENTS_URL}/health`);
    return response.data;
  },

  async getPaymentEvents() {
    const response = await axios.get(`${PAYMENTS_URL}/events`);
    return response.data;
  },

  async sendPaymentWebhook(event: Record<string, unknown>) {
    const response = await axios.post(`${PAYMENTS_URL}/webhook/payment-received`, event);
    return response.data;
  },
};

export default apiService;
