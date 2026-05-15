/**
 * Authorize.net Accept.js Integration
 * 
 * Uses the client-side Accept.js library to tokenize card data,
 * then sends the opaque data (nonce) to Authorize.net's API for processing.
 * 
 * Flow:
 * 1. Accept.js tokenizes the card in-browser (PCI compliant — card data never touches our server)
 * 2. We get back an opaque data descriptor + value (nonce)
 * 3. We send the nonce + amount to Authorize.net's createTransactionRequest API
 * 
 * Environment: Controlled by VITE_AUTHNET_ENVIRONMENT ("sandbox" or "production")
 */

const API_LOGIN_ID = import.meta.env.VITE_AUTHNET_API_LOGIN_ID || '';
const CLIENT_KEY = import.meta.env.VITE_AUTHNET_CLIENT_KEY || '';
const TRANSACTION_KEY = import.meta.env.VITE_AUTHNET_TRANSACTION_KEY || '';
const ENVIRONMENT = import.meta.env.VITE_AUTHNET_ENVIRONMENT || 'sandbox';

const API_URL = ENVIRONMENT === 'production'
  ? 'https://api.authorize.net/xml/v1/request.api'
  : 'https://apitest.authorize.net/xml/v1/request.api';

const ACCEPT_JS_URL = ENVIRONMENT === 'production'
  ? 'https://js.authorize.net/v1/Accept.js'
  : 'https://jstest.authorize.net/v1/Accept.js';

// ── Accept.js Script Loader ──
let acceptJsLoaded = false;
export const loadAcceptJs = (): Promise<void> => {
  if (acceptJsLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    // Check if already in DOM
    if (document.querySelector(`script[src="${ACCEPT_JS_URL}"]`)) {
      acceptJsLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = ACCEPT_JS_URL;
    script.onload = () => { acceptJsLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Accept.js'));
    document.head.appendChild(script);
  });
};

// ── Types ──
export interface CardData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface AuthNetNonce {
  opaqueDataDescriptor: string;
  opaqueDataValue: string;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  message: string;
  responseCode?: string;
  rawResponse?: any;
}

// ── Step 1: Tokenize card via Accept.js ──
export const tokenizeCard = (card: CardData): Promise<AuthNetNonce> => {
  return new Promise((resolve, reject) => {
    const secureData = {
      authData: {
        clientKey: CLIENT_KEY,
        apiLoginID: API_LOGIN_ID,
      },
      cardData: {
        cardNumber: card.cardNumber.replace(/\s/g, ''),
        month: card.expMonth.padStart(2, '0'),
        year: card.expYear.length === 2 ? '20' + card.expYear : card.expYear,
        cardCode: card.cvv,
      },
    };

    const responseHandler = (response: any) => {
      if (response.messages.resultCode === 'Error') {
        const errorMessages = response.messages.message.map((m: any) => m.text).join('; ');
        reject(new Error(errorMessages));
      } else {
        resolve({
          opaqueDataDescriptor: response.opaqueData.dataDescriptor,
          opaqueDataValue: response.opaqueData.dataValue,
        });
      }
    };

    // Accept.js global function
    (window as any).Accept.dispatchData(secureData, responseHandler);
  });
};

// ── Step 2: Charge via Authorize.net API ──
export const chargePayment = async (
  nonce: AuthNetNonce,
  amount: string,
  invoice?: string,
  description?: string,
  customerEmail?: string,
  billTo?: { firstName?: string; lastName?: string }
): Promise<TransactionResult> => {
  const payload: any = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: API_LOGIN_ID,
        transactionKey: TRANSACTION_KEY,
      },
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: amount,
        payment: {
          opaqueData: {
            dataDescriptor: nonce.opaqueDataDescriptor,
            dataValue: nonce.opaqueDataValue,
          },
        },
        order: {
          invoiceNumber: invoice || `INV-${Date.now().toString(36).toUpperCase()}`,
          description: description || 'GGP-OS Payment',
        },
      },
    },
  };

  // Optional customer info
  if (customerEmail) {
    payload.createTransactionRequest.transactionRequest.customer = { email: customerEmail };
  }
  if (billTo?.firstName || billTo?.lastName) {
    payload.createTransactionRequest.transactionRequest.billTo = {
      firstName: billTo.firstName || '',
      lastName: billTo.lastName || '',
    };
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    // Authorize.net sometimes returns BOM character
    const cleanText = text.replace(/^\uFEFF/, '');
    const data = JSON.parse(cleanText);

    const txResponse = data.transactionResponse;
    const messages = data.messages;

    if (messages?.resultCode === 'Ok' && txResponse?.responseCode === '1') {
      return {
        success: true,
        transactionId: txResponse.transId,
        authCode: txResponse.authCode,
        message: `Approved (Auth: ${txResponse.authCode})`,
        responseCode: txResponse.responseCode,
        rawResponse: data,
      };
    } else {
      const errorMsg = txResponse?.errors?.error?.[0]?.errorText
        || txResponse?.messages?.message?.[0]?.description
        || messages?.message?.[0]?.text
        || 'Transaction declined';
      return {
        success: false,
        message: errorMsg,
        responseCode: txResponse?.responseCode,
        rawResponse: data,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to Authorize.net',
    };
  }
};

// ── Convenience: Full charge flow (tokenize + charge) ──
export const processCardPayment = async (
  card: CardData,
  amount: string,
  options?: {
    invoice?: string;
    description?: string;
    customerEmail?: string;
    billTo?: { firstName?: string; lastName?: string };
  }
): Promise<TransactionResult> => {
  await loadAcceptJs();
  const nonce = await tokenizeCard(card);
  return chargePayment(
    nonce,
    amount,
    options?.invoice,
    options?.description,
    options?.customerEmail,
    options?.billTo
  );
};

// ── Configuration check ──
export const isConfigured = (): boolean => {
  return !!(API_LOGIN_ID && CLIENT_KEY && TRANSACTION_KEY);
};

export const getEnvironment = (): string => ENVIRONMENT;
