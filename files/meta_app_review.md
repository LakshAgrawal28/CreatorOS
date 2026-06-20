# CreatorOS Meta App Review Package

This guide details the requirements, scopes, and instructions necessary to prepare and submit **CreatorOS** for Meta App Review. This documentation ensures that reviewers from Meta can successfully verify the application’s usage of the Graph API and Instagram Graph API.

---

## 1. 🔑 Required Scopes & Permissions

To successfully ingest Instagram professional account metrics, CreatorOS requests the following permissions during the **Login with Facebook** flow:

| Scope / Permission | Purpose | Usage in CreatorOS |
| :--- | :--- | :--- |
| `instagram_basic` | Read basic profile info | Fetches Instagram username, profile picture, and account type to display on the CreatorOS dashboard. |
| `instagram_manage_insights` | Access account performance metrics | Retreives follower growth, engagement rates, average likes, reach, impressions, and video view counts for analytics. |
| `pages_show_list` | List connected Facebook Pages | Allows the user to select the Facebook Page connected to their Instagram Professional Account. |
| `pages_read_engagement` | Read Facebook Page metadata | Reads connected page tokens required by Meta to query the linked Instagram Business account. |

---

## 2. 📝 Step-by-Step Submission Guide

Follow these steps inside the [Meta App Dashboard](https://developers.facebook.com/) to submit the app:

### Step A: Configure Basic Settings
1. Navigate to **App Settings** > **Basic**.
2. Provide a valid **Privacy Policy URL** (e.g., `https://creatoros.com/privacy`).
3. Provide a valid **User Data Deletion Callback URL** (e.g., `https://creatoros.com/api/auth/delete-user`).
4. Select a category (e.g., **Business and Utility**).
5. Upload a high-resolution app icon (512x512 pixels).

### Step B: App Review Request
1. Go to **App Review** > **Permissions and Features**.
2. Click **Request Advanced Access** for each of the required scopes listed above.
3. Click **Edit Submission** to add walkthrough instructions and screen recording files.

---

## 3. 🧪 Test Account & Environment Setup

To allow Meta reviewers to test the integration without exposing live production credentials, you must provide a pre-configured Facebook Test User with a connected Instagram Professional account.

### Preparing the Test User:
1. Go to **App Roles** > **Test Users** in the Meta Developer Console.
2. Create a new test user and enable the **Authorize Test User for this App** option.
3. Log in as the test user and create a new **Facebook Page** (e.g., "CreatorOS Test Brand").
4. Using a mobile device or Instagram Emulator, create a mock **Instagram Business Account** (or Creator Account).
5. Connect the Instagram Account to the Facebook Page created in Step 3 via **Page Settings** > **Linked Accounts**.
6. Provide these credentials in the review notes:
   - **Facebook Login Email**: `test-creator-user@tfbnw.net` (from Meta Test Users panel)
   - **Password**: `[Generated Password]`

---

## 4. 📹 Screencast Walkthrough Requirements

Meta requires a high-quality video showing exactly how permissions are requested and used. Record a screencast following this script:

1. **Step 1: Oauth Initiation**
   - Show the user navigating to the CreatorOS landing page and clicking the **"Link Instagram Account"** button.
   - Show the standard Facebook OAuth pop-up appearing, displaying the `CreatorOS` application name and requesting permissions.
2. **Step 2: Connected State**
   - Log in with the test user and authorize all requested permissions.
   - Show the redirect back to the CreatorOS dashboard (`/dashboard`).
3. **Step 3: Feature Highlight**
   - Navigate to the **Dashboard Overview** to show the fetched profile metrics (follower count, engagement rates).
   - Navigate to **Analytics Hub** to demonstrate how CreatorOS uses `instagram_manage_insights` to render historical graphs and demographics.

---

## 5. 🔒 Privacy Policy & Data Deletion Compliance

Your production website must serve policies matching these specifications:

### Privacy Policy Clause:
> "CreatorOS requests read-only access to your connected Instagram profile info and daily performance metrics. We store profile username, profile photo, follower totals, and post interaction metrics to generate sponsorship matchmaking scores. We do not write, modify, or delete any content on your Instagram profile. We never share or sell raw performance metrics with third parties."

### User Data Deletion Request Endpoint:
- **Endpoint**: `POST https://creatoros.com/api/auth/delete-user`
- **Response Format**:
  ```json
  {
    "url": "https://creatoros.com/api/auth/deletion-status?id=DEL_12345",
    "confirmation_code": "DEL_12345"
  }
  ```
- **Action**: When called, this webhook deletes the user's OAuth access tokens, profile metrics, and associated embeddings from the Neon Database.
