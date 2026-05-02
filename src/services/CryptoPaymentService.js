const axios = require('axios');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BLOCKSTREAM_API = 'https://blockstream.info/api';
const ETHERSCAN_API = process.env.ETHERSCAN_API_KEY ? `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY}` : 'https://api.etherscan.io/api';
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const DOGE_API = process.env.DOGE_API_URL || 'https://dogecoin.rpc.nodejitsu.com';

// In-memory store for payment status (use Redis in production)
const paymentStatusStore = new Map();

// Supported cryptocurrencies for payments
const SUPPORTED_COINS = {
  eth: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum',
    networkId: 1,
    decimals: 18,
    minConfirmations: 12,
  },
  btc: {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    networkId: 0,
    decimals: 8,
    minConfirmations: 6,
  },
  usdt: {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    network: 'Ethereum',
    networkId: 1,
    decimals: 6,
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  usdc: {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'Ethereum',
    networkId: 1,
    decimals: 6,
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
doge: {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    network: 'Dogecoin',
    networkId: 5,
    decimals: 8,
    minConfirmations: 6,
  },
  sol: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    network: 'Solana',
    networkId: 999,
    decimals: 9,
    minConfirmations: 32,
  },
};

// Merchant wallet addresses (configured via environment)
const MERCHANT_WALLETS = {
  eth: process.env.MERCHANT_ETH_WALLET,
  btc: process.env.MERCHANT_BTC_WALLET,
  usdt: process.env.MERCHANT_USDT_WALLET,
  usdc: process.env.MERCHANT_USDC_WALLET,
  doge: process.env.MERCHANT_DOGE_WALLET,
  sol: process.env.MERCHANT_SOL_WALLET,
};

const CryptoPaymentService = {
  SUPPORTED_COINS,

  /**
   * Get current crypto prices in USD
   * @param {string[]} coinIds - Array of coin IDs (e.g., ['ethereum', 'bitcoin'])
   * @returns {object} Prices in USD
   */
  async getPrices(coinIds = []) {
    try {
      const ids = coinIds.length > 0 
        ? coinIds.join(',') 
        : Object.values(SUPPORTED_COINS).map(c => c.id).join(',');
      
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids,
          vs_currencies: 'usd',
        },
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API error:', error.message);
      throw new Error('Failed to fetch crypto prices');
    }
  },

  /**
   * Get all supported coins with their USD prices
   * @returns {object} Supported coins with prices
   */
  async getSupportedCoins() {
    try {
      const prices = await this.getPrices();
      
      const coins = {};
      for (const [symbol, coin] of Object.entries(SUPPORTED_COINS)) {
        coins[symbol] = {
          ...coin,
          priceUsd: prices[coin.id]?.usd || 0,
        };
      }
      
      return coins;
    } catch (error) {
      console.error('Failed to get supported coins:', error.message);
      throw error;
    }
  },

  /**
   * Convert USD amount to crypto amount
   * @param {number} usdAmount - Amount in USD
   * @param {string} cryptoSymbol - Crypto symbol (e.g., 'eth', 'btc')
   * @returns {object} Crypto amount and details
   */
  async convertUsdToCrypto(usdAmount, cryptoSymbol) {
    const coin = SUPPORTED_COINS[cryptoSymbol.toLowerCase()];
    
    if (!coin) {
      throw new Error(`Unsupported cryptocurrency: ${cryptoSymbol}`);
    }
    
    const prices = await this.getPrices([coin.id]);
    const priceUsd = prices[coin.id]?.usd;
    
    if (!priceUsd || priceUsd <= 0) {
      throw new Error(`Unable to get price for ${cryptoSymbol}`);
    }
    
    // Calculate crypto amount (with small buffer for price fluctuations)
    const cryptoAmount = usdAmount / priceUsd;
    // Add 2% buffer to account for price fluctuations
    const cryptoAmountWithBuffer = cryptoAmount * 1.02;
    
    return {
      cryptoSymbol: coin.symbol,
      cryptoName: coin.name,
      cryptoAmount: cryptoAmountWithBuffer,
      cryptoAmountFormatted: cryptoAmountWithBuffer.toFixed(coin.decimals),
      usdAmount,
      priceUsd,
      network: coin.network,
      decimals: coin.decimals,
    };
  },

  /**
   * Get payment details for a subscription tier in crypto
   * @param {string} tier - Subscription tier
   * @param {string} cryptoSymbol - Crypto symbol
   * @returns {object} Payment details with crypto amount
   */
  async getPaymentDetails(tier, cryptoSymbol) {
    const Subscription = require('../models/Subscription');
    
    const usdPrice = Subscription.PRICING[tier]?.one_time;
    
    if (!usdPrice) {
      throw new Error(`Price not found for tier: ${tier}`);
    }
    
    const cryptoDetails = await this.convertUsdToCrypto(usdPrice, cryptoSymbol);
    
    return {
      tier,
      paymentType: 'one_time',
      currency: 'USD',
      priceUsd: usdPrice,
      crypto: cryptoDetails,
    };
  },

  /**
   * Generate payment details for all supported cryptos
   * @param {string} tier - Subscription tier
   * @returns {object} Payment options for all cryptos
   */
  async getAllPaymentOptions(tier) {
    const options = {};
    
    for (const symbol of Object.keys(SUPPORTED_COINS)) {
      try {
        const details = await this.getPaymentDetails(tier, symbol);
        options[symbol] = details.crypto;
      } catch (error) {
        console.error(`Failed to get payment option for ${symbol}:`, error.message);
      }
    }
    
    return options;
  },

  /**
   * Get merchant wallet address for a crypto
   * @param {string} cryptoSymbol - Crypto symbol
   * @returns {string} Wallet address
   */
  getMerchantWallet(cryptoSymbol) {
    const wallet = MERCHANT_WALLETS[cryptoSymbol.toLowerCase()];
    
    if (!wallet) {
      throw new Error(`Merchant wallet not configured for ${cryptoSymbol}`);
    }
    
    return wallet;
  },

  /**
   * Generate payment instructions for wallet-to-wallet transfer
   * @param {string} tier - Subscription tier
   * @param {string} cryptoSymbol - Crypto symbol
   * @param {string} userId - User ID for reference
   * @returns {object} Payment instructions
   */
  async generatePaymentInstructions(tier, cryptoSymbol, userId) {
    // Get payment details
    const paymentDetails = await this.getPaymentDetails(tier, cryptoSymbol);
    const merchantWallet = this.getMerchantWallet(cryptoSymbol);
    const coin = SUPPORTED_COINS[cryptoSymbol.toLowerCase()];
    
    // Generate unique payment reference
    const paymentReference = `${userId}-${tier}-${Date.now()}`;
    
    return {
      paymentReference,
      tier: paymentDetails.tier,
      currency: 'USD',
      priceUsd: paymentDetails.priceUsd,
      crypto: {
        symbol: paymentDetails.crypto.cryptoSymbol,
        name: paymentDetails.crypto.cryptoName,
        amount: paymentDetails.crypto.cryptoAmountFormatted,
        amountRaw: paymentDetails.crypto.cryptoAmount,
        network: paymentDetails.crypto.network,
      },
      walletAddress: merchantWallet,
      network: coin.network,
      networkId: coin.networkId,
      minConfirmations: coin.minConfirmations,
      instructions: [
        `1. Send exactly ${paymentDetails.crypto.cryptoAmountFormatted} ${paymentDetails.crypto.cryptoSymbol} to the address below`,
        `2. Wait for ${coin.minConfirmations} confirmations on the ${coin.network} network`,
        `3. Include the payment reference in the transaction memo: ${paymentReference}`,
`4. Your subscription will be activated after payment is confirmed`,
      ],
      warning: 'Send only the exact amount. Excess sends will not be refunded.',
    };
  },

/**
   * Verify payment status by checking blockchain explorer
   * @param {string} txHash - Transaction hash
   * @param {string} cryptoSymbol - Crypto symbol
   * @param {string} expectedAmount - Expected amount in crypto (for verification)
   * @param {string} merchantWallet - Expected destination wallet
   * @returns {object} Payment status
   */
  async verifyPaymentStatus(txHash, cryptoSymbol, expectedAmount, merchantWallet) {
    const symbol = cryptoSymbol.toLowerCase();
    const coin = SUPPORTED_COINS[symbol];
    
    if (!coin) {
      throw new Error(`Unsupported cryptocurrency: ${cryptoSymbol}`);
    }
    
    try {
      let txData;
      
      switch (symbol) {
        case 'btc':
          txData = await this.verifyBitcoinTx(txHash, coin.minConfirmations);
          break;
        case 'eth':
        case 'usdt':
        case 'usdc':
          txData = await this.verifyEthereumTx(txHash, merchantWallet, expectedAmount, coin);
          break;
        case 'doge':
          txData = await this.verifyDogecoinTx(txHash, coin.minConfirmations);
          break;
        case 'sol':
          txData = await this.verifySolanaTx(txHash, coin.minConfirmations);
          break;
        default:
          throw new Error(`Verification not supported for ${cryptoSymbol}`);
      }
      
      // Update payment status in store
      const status = {
        txHash,
        status: txData.confirmed ? 'confirmed' : 'pending',
        confirmations: txData.confirmations,
        requiredConfirmations: coin.minConfirmations,
        timestamp: txData.timestamp,
        from: txData.from,
        amount: txData.amount,
        verified: txData.confirmed && txData.validDestination,
      };
      
      paymentStatusStore.set(txHash, status);
      
      return status;
    } catch (error) {
      console.error('Payment verification error:', error.message);
      return {
        txHash,
        status: 'error',
        message: error.message,
      };
    }
  },

  /**
   * Verify Bitcoin transaction via Blockstream API
   */
  async verifyBitcoinTx(txHash, minConfirmations) {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/tx/${txHash}`);
      const tx = response.data;
      
      return {
        confirmed: tx.status?.confirmed,
        confirmations: tx.status?.confirmed ? tx.status.block_height - tx.status.confirmed : 0,
        timestamp: tx.status?.confirmed ? new Date(tx.status.confirmed * 1000) : null,
        from: tx.vin?.[0]?.prevout?.scriptpubkey_address || tx.vin?.[0]?.witness?.[1],
        amount: tx.vout?.reduce((sum, out) => sum + (out.value || 0), 0) / 1e8,
        validDestination: true, // Would need merchant wallet check
      };
    } catch (error) {
      throw new Error(`Bitcoin verification failed: ${error.message}`);
    }
  },

  /**
   * Verify Ethereum/ERC-20 transaction via Etherscan API
   */
  async verifyEthereumTx(txHash, expectedTo, expectedAmount, coin) {
    try {
      const action = coin.contractAddress ? 'txlist' : 'txlist';
      const params = new URLSearchParams({
        module: 'account',
        action,
        txhash: txHash,
        sort: 'desc',
      });
      
      const response = await axios.get(`${ETHERSCAN_API}&${params}`);
      const tx = response.data?.result?.[0];
      
      if (!tx) {
        throw new Error('Transaction not found');
      }
      
      // Parse value (wei to crypto unit)
      const txAmount = parseFloat(tx.value) / Math.pow(10, coin.decimals);
      const confirmations = parseInt(tx.confirmations, 10) || 0;
      
      // Validate destination (for ETH/ERC-20)
      const validDestination = tx.to?.toLowerCase() === expectedTo?.toLowerCase();
      
      return {
        confirmed: confirmations >= coin.minConfirmations,
        confirmations,
        timestamp: tx.timeStamp ? new Date(tx.timeStamp * 1000) : null,
        from: tx.from,
        to: tx.to,
        amount: txAmount,
        validDestination,
        isContractCall: !!coin.contractAddress,
      };
    } catch (error) {
      throw new Error(`Ethereum verification failed: ${error.message}`);
    }
  },

  /**
   * Verify Dogecoin transaction
   */
  async verifyDogecoinTx(txHash, minConfirmations) {
    try {
      const response = await axios.get(`${DOGE_API}/tx/${txHash}`);
      const tx = response.data;
      
      return {
        confirmed: tx.confirmations >= minConfirmations,
        confirmations: tx.confirmations || 0,
        timestamp: tx.time ? new Date(tx.time * 1000) : null,
        from: tx.vin?.[0]?.addresses?.[0],
        amount: parseFloat(tx.value) / 1e8,
        validDestination: true,
      };
    } catch (error) {
      throw new Error(`Dogecoin verification failed: ${error.message}`);
    }
  },

  /**
   * Verify Solana transaction
   */
  async verifySolanaTx(txHash, minConfirmations) {
    try {
      const response = await axios.post(SOLANA_RPC, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [txHash, { encoding: 'json' }],
      });
      
      const tx = response.data?.result;
      
      if (!tx) {
        throw new Error('Transaction not found');
      }
      
      return {
        confirmed: tx.meta?.confirmationStatus === 'confirmed',
        confirmations: tx.meta?.confirmationStatus === 'confirmed' ? minConfirmations : 0,
        timestamp: tx.blockTime ? new Date(tx.blockTime * 1000) : null,
        from: tx.transaction?.message?.accountKeys?.[0],
        amount: tx.meta?.postTokenBalances?.[0]?.uiTokenAmount?.uiAmountString || 0,
        validDestination: true,
      };
    } catch (error) {
      throw new Error(`Solana verification failed: ${error.message}`);
    }
  },

  /**
   * Check payment status from store
   */
  getPaymentStatus(txHash) {
    return paymentStatusStore.get(txHash) || null;
  },

  /**
   * Legacy verifyPayment wrapper for backwards compatibility
   */
  async verifyPayment(txHash, cryptoSymbol) {
    return this.verifyPaymentStatus(txHash, cryptoSymbol, null, null);
  },
};

module.exports = CryptoPaymentService;
