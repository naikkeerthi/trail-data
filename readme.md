# 🔐 Authentication Setup for Development

To enable API access during development in this Node.js project, follow the steps below to log in, retrieve your token, update the development credentials, and start the project in dev mode.


#### ⚠️ NOTE: The following steps are intended for development purposes only and should not be used in production environments
---

## ✅ Step-by-Step Instructions

### 1. Login to Tincaphe Portal

1. Open your browser and go to:  
   [https://tincaphe.com/auth/login](https://tincaphe.com/auth/login)

2. Use the **development credentials** to log in:
   - **Username**: `Integrated3`
   - **Password**: `7979`

3. Once successfully logged in, **do not log out** from this session

---

### 2. Capture the Authorization Token

1. Open browser **DevTools** (`Right-click → Inspect` or press `F12`)
2. Click the **Network** tab.
3. Log in using the credentials above.
4. Find the login or authentication API request (usually a `POST`).
5. Click on the `GetValue` endpoint and go to the **Headers** tab.
6. Under **Request Headers**, find the `Authorization` field.
7. Copy the entire token value **excluding** the `"Bearer "` prefix (e.g., starts with `ey...`).

---

### 3. Store the Token in Code

Paste the copied token into your constants file:

```js
// index.js

// NOTE: This token is for development purposes only.
// Make sure to remove it once development is complete.

let generatedTokenForAuthenticate = "YOUR_COPIED_TOKEN_HERE";

```

### 5. Start the Server

Once everything is set up, start the development server using:

```bash
npm start
```