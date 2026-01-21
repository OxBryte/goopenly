// lib/bridge.ts
import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export interface BridgeCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'rejected' | 'under_review';
  endorsements: Array<{
    name: string;
    status: 'approved' | 'incomplete' | 'denied';
  }>;
}

export interface LiquidationAddress {
  id: string;
  chain: 'solana' | 'ethereum' | 'polygon';
  currency: 'usdc' | 'usdt';
  address: string; // The crypto wallet address receiving the funds
  banking_instructions: {
    bank_name: string;
    account_number: string;
    routing_number: string;
    beneficiary_name: string;
  };
}

export interface CardAccount {
  id: string;
  card_id: string;
  last_4: string;
  expiry_month: string;
  expiry_year: string;
  currency: 'usdc';
  balance: string;
  status: 'active' | 'frozen' | 'canceled';
}

// --- Configuration ---

const BRIDGE_API_KEY = process.env.BRIDGE_API_KEY!;
const IS_SANDBOX = process.env.NODE_ENV !== 'production';
const BASE_URL = IS_SANDBOX 
  ? 'https://api.sandbox.bridge.xyz/v0' 
  : 'https://api.bridge.xyz/v0';

// --- Client ---

export const BridgeService = {
  /**
   * Helper for authenticated requests
   */
  async request<T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Api-Key': BRIDGE_API_KEY,
      'Idempotency-Key': uuidv4(), // Unique key for every request to prevent double-charges
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Bridge API Error: ${errorBody.message || response.statusText}`);
    }

    return response.json();
  },

  /**
   * 1. Create a Customer (Individual)
   * Required for KYC and issuing accounts.
   */
  async createCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string; // YYYY-MM-DD
    address: { street: string; city: string; state: string; postalCode: string; country: 'US' | 'NG' | string };
    ssn?: string; // Last 4 or full depending on tier
  }): Promise<BridgeCustomer> {
    return this.request<BridgeCustomer>('/customers', 'POST', {
      type: 'individual',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      address: {
        street_line_1: data.address.street,
        city: data.address.city,
        state: data.address.state,
        postal_code: data.address.postalCode,
        country: data.address.country,
      },
      // In production, you typically send KYC links, but this is for direct creation
    });
  },

  /**
   * 2. Create a "Virtual Account" (Liquidation Address)
   * This gives the user a US Bank Account number.
   * Any USD sent here is auto-converted to USDC and sent to 'destination_address'.
   */
  async createVirtualAccount(customerId: string, destinationWalletAddress: string): Promise<LiquidationAddress> {
    return this.request<LiquidationAddress>(`/customers/${customerId}/liquidation_addresses`, 'POST', {
      chain: 'solana',
      currency: 'usdc',
      destination_address: destinationWalletAddress,
    });
  },

  /**
   * 3. Issue a Virtual Card
   * Creates a card backed by a specific USDC wallet balance.
   */
  async issueVirtualCard(customerId: string, walletAddress: string): Promise<CardAccount> {
    // Note: In Sandbox, card issuance is instant. In Prod, may require KYC 'approved' status.
    return this.request<CardAccount>(`/customers/${customerId}/card_accounts`, 'POST', {
      currency: 'usdc',
      chain: 'solana',
      source_address: walletAddress, // The wallet the card spends from
      spend_limit: {
        amount: '1000', // Default daily limit
        interval: 'daily'
      }
    });
  },

  /**
   * 4. Get Card Details (Sensitive)
   * Returns PAN, CVV, etc. Usually requires a separate PCI-compliant token exchange in frontend.
   * This backend endpoint allows you to view details if your PCI compliance level permits.
   */
  async getCardDetails(customerId: string, cardAccountId: string) {
    return this.request<any>(`/customers/${customerId}/card_accounts/${cardAccountId}/details`, 'GET');
  }
};
