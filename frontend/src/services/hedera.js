import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class HederaService {
  constructor() {
    this.accountId = null;
    this.privateKey = null;
  }

  async connectWallet(accountId, privateKey) {
    // No-op in browser: we do not use @hashgraph/sdk on the client to avoid polyfills
    this.accountId = accountId;
    this.privateKey = privateKey;
    return { success: true, accountId };
  }

  async submitAuditMessage(topicId, message) {
    try {
      const { data } = await axios.post(`${API_BASE}/hedera/audit`, {
        topicId,
        message
      });
      return data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getTopicMessages(topicId, { limit = 10, sequenceNumber } = {}) {
    try {
      const params = new URLSearchParams();
      if (limit) params.set('limit', String(limit));
      if (sequenceNumber) params.set('sequenceNumber', String(sequenceNumber));
      const { data } = await axios.get(`${API_BASE}/hedera/topics/${topicId}/messages?${params.toString()}`);
      return data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getAccountBalance(accountId) {
    try {
      const id = accountId || this.accountId;
      const { data } = await axios.get(`${API_BASE}/hedera/account/${id}/balance`);
      return data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async verifyTransaction(transactionId) {
    try {
      const { data } = await axios.get(`${API_BASE}/hedera/transactions/${encodeURIComponent(transactionId)}`);
      return data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  disconnect() {
    this.accountId = null;
    this.privateKey = null;
  }
}

export default new HederaService();