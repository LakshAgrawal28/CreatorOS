interface MetaAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface InstagramProfileData {
  id: string;
  username: string;
  name: string;
  biography?: string;
  profile_picture_url?: string;
  followers_count: number;
  media_count: number;
}

/**
 * Exchanges a client-side short-lived Facebook User token for a 60-day long-lived User Access Token.
 */
export async function exchangeShortLivedToken(shortToken: string): Promise<string> {
  const appId = process.env.FACEBOOK_CLIENT_ID;
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Missing FACEBOOK_CLIENT_ID or FACEBOOK_CLIENT_SECRET environment variables.");
  }

  const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;

  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Meta Token Exchange Failure: ${JSON.stringify(err)}`);
  }

  const data = (await response.json()) as MetaAccessTokenResponse;
  return data.access_token;
}

/**
 * Traverses a user's Facebook Pages to find a linked Instagram Business/Creator Account.
 */
export async function getInstagramAccountId(longLivedToken: string): Promise<string> {
  const pagesUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedToken}`;
  const pagesResponse = await fetch(pagesUrl);
  if (!pagesResponse.ok) {
    const err = await pagesResponse.json();
    throw new Error(`Failed to fetch Facebook accounts: ${JSON.stringify(err)}`);
  }

  const pagesData = await pagesResponse.json();
  const pages = pagesData.data || [];

  if (pages.length === 0) {
    throw new Error("No Facebook Pages linked to this Meta account.");
  }

  // Find the first Page with an active Instagram Business/Creator Account linkage
  for (const page of pages) {
    const pageId = page.id;
    const pageDetailUrl = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${longLivedToken}`;
    const pageDetailResponse = await fetch(pageDetailUrl);

    if (pageDetailResponse.ok) {
      const pageDetail = await pageDetailResponse.json();
      if (pageDetail.instagram_business_account?.id) {
        return pageDetail.instagram_business_account.id;
      }
    }
  }

  throw new Error("No Instagram Business or Creator accounts linked to any of your Facebook Pages.");
}

/**
 * Fetches basic public details and counts for the specified Instagram Business Account.
 */
export async function getInstagramProfile(
  instagramAccountId: string,
  longLivedToken: string
): Promise<InstagramProfileData> {
  const url = `https://graph.facebook.com/v20.0/${instagramAccountId}?fields=username,name,biography,profile_picture_url,followers_count,media_count&access_token=${longLivedToken}`;

  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Failed to fetch Instagram Profile: ${JSON.stringify(err)}`);
  }

  return (await response.json()) as InstagramProfileData;
}
