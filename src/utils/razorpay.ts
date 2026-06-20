const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

const isSandboxMode = !keyId || !keySecret;

/**
 * Helper to fetch with Razorpay basic auth.
 */
async function razorpayFetch(endpoint: string, options: RequestInit = {}) {
  if (isSandboxMode) {
    console.warn(`Razorpay API key is missing. Running in Simulated Sandbox Mode for endpoint: ${endpoint}`);
    return null;
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
    ...(options.headers || {}),
  };

  const response = await fetch(`https://api.razorpay.com${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Creates a Linked Account in Razorpay Route for a creator.
 */
export async function createLinkedAccount(data: {
  email: string;
  phone: string;
  name: string;
  postalCode: string;
  street: string;
  city: string;
  state: string;
}) {
  if (isSandboxMode) {
    return {
      id: `acc_mock_${Math.random().toString(36).substring(2, 11)}`,
      email: data.email,
      type: "route",
      status: "created",
    };
  }

  return razorpayFetch("/v2/accounts", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      phone: data.phone,
      type: "route",
      reference_id: `creator_${Date.now()}`,
      legal_business_name: data.name,
      business_type: "individual",
      contact_name: data.name,
      profile: {
        category: "social_media_influencer",
        subcategory: "social_networks",
        addresses: {
          registered: {
            street: data.street,
            city: data.city,
            state: data.state,
            postal_code: data.postalCode,
            country: "IN",
          },
        },
      },
    }),
  });
}

/**
 * Creates a Razorpay Order ID for brand campaign deposits.
 * Note: Razorpay expects the amount in paise (e.g. Rs. 100 is 10000 paise).
 */
export async function createRazorpayOrder(amountInInr: number) {
  const amountInPaise = Math.round(amountInInr * 100);

  if (isSandboxMode) {
    return {
      id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
      amount: amountInPaise,
      currency: "INR",
      receipt: `escrow_receipt_mock_${Date.now()}`,
      status: "created",
    };
  }

  return razorpayFetch("/v1/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: `escrow_receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment on success
    }),
  });
}

/**
 * Transfers escrow funds to the creator's Razorpay Linked Account (split payment).
 * amountInInr: Payout amount in INR.
 * platformFeeInInr: Fee to keep on the platform in INR.
 */
export async function transferEscrowFunds(paymentId: string, linkedAccountId: string, amountInInr: number) {
  const amountInPaise = Math.round(amountInInr * 100);
  
  if (isSandboxMode) {
    return {
      id: `trf_mock_${Math.random().toString(36).substring(2, 11)}`,
      transfers: [
        {
          id: `trf_sub_mock_${Date.now()}`,
          account: linkedAccountId,
          amount: amountInPaise,
          currency: "INR",
          status: "processed",
        }
      ]
    };
  }

  return razorpayFetch(`/v1/payments/${paymentId}/transfers`, {
    method: "POST",
    body: JSON.stringify({
      transfers: [
        {
          account: linkedAccountId,
          amount: amountInPaise,
          currency: "INR",
          notes: {
            payment_type: "creator_sponsorship_release",
          },
          on_hold: false,
        },
      ],
    }),
  });
}
