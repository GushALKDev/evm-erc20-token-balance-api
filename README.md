
# ERC20 Token Balance API

## Introduction

This project is a simple API built with Node.js and Express that allows users to retrieve the balance of any ERC20 token. It uses Ethers.js to interact with the Ethereum blockchain and supports cross-origin requests with CORS.

## Features

- Retrieve the balance of a specific ERC20 token (e.g., USDT) for a given Ethereum wallet address.
- Validate Ethereum wallet addresses with checksum verification.
- Error handling for invalid requests and blockchain-related issues.
- Uses environment variables for secure configuration of private keys, token addresses, and RPC endpoints.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for handling API routes.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **dotenv**: For managing environment variables.
- **CORS**: To handle cross-origin requests.
- **body-parser**: For parsing incoming JSON requests.

## Endpoints

### POST `/get_balance`

Retrieves the balance of the configured ERC20 token (e.g., USDT) for a specified Ethereum wallet address.

#### Request Body

```json
{
  "address": "0xYourWalletAddressHere"
}
```

#### Response

- **Success**:
  ```json
  {
    "address": "0xYourWalletAddressHere",
    "USDT balance": "100.123"
  }
  ```

- **Error**:
  ```json
  {
    "error": "Bad address checksum."
  }
  ```

  or

  ```json
  {
    "error": "get_balance request: Missing address."
  }
  ```

## How to Use

### Setup

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   yarn
   ```
3. Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   PK=<Your_Private_Key>
   USDT_ADDRESS=<USDT_Contract_Address>
   ETH_RPC=<Ethereum_RPC_URL>
   ```

### Running the Server

Start the server locally with:

```bash
yarn start
```

This will start the API on port `3001` by default.

### Testing the API

Use tools like Postman, Curl, or your frontend application to test the `/get_balance` endpoint. Simulate various scenarios, such as valid addresses, missing data, or invalid checksums, to confirm proper error handling.

#### Example Scenarios

##### Valid Address

**Request Payload**:
```json
{
  "address": "0xValidEthereumAddressHere"
}
```

**Expected Response**:
```json
{
  "address": "0xValidEthereumAddressHere",
  "USDT balance": "123.45"
}
```

##### Missing Address

**Request Payload**:
```json
{}
```

**Expected Response**:
```json
{
  "error": "get_balance request: Missing address."
}
```

##### Invalid Address (Bad Checksum)

**Request Payload**:
```json
{
  "address": "0xInvalidChecksumAddress"
}
```

**Expected Response**:
```json
{
  "error": "Bad address checksum."
}
```

##### RPC or Network Errors

If there are issues with the RPC endpoint or contract interaction, the API will log the error on the server and return a response like this:

**Expected Response**:
```json
{
  "error": "Unable to retrieve balance."
}
```

## Deployment Steps

To deploy this API in a production environment:

1. **Set Environment Variables**:
   Configure the required environment variables in your production environment:
   - `PK`: Your Ethereum wallet's private key.
   - `USDT_ADDRESS`: The ERC20 contract address (e.g., USDT).
   - `ETH_RPC`: A valid Ethereum RPC URL.

2. **Use a Process Manager**:
   Deploy the API using a process manager like PM2 for improved reliability:
   ```bash
   pm2 start index.js --name "erc20-balance-api"
   ```

3. **Expose the API**:
   Use a reverse proxy (e.g., NGINX) or cloud provider networking tools to expose the API over HTTPS for secure access.

## Enhancements for Production

- **Dynamic Token Support**:
  Modify the `/get_balance` endpoint to accept any ERC20 token contract address in the request payload.

- **Batch Requests**:
  Enable support for querying balances of multiple addresses in a single request to improve efficiency.

- **API Rate Limiting**:
  Add rate limiting to prevent abuse and ensure consistent performance under high traffic.

- **Authentication**:
  Implement an API key system to restrict access to authorized clients only.

- **Caching**:
  Introduce a caching mechanism to store recent balance queries and reduce RPC call overhead.

## Example Frontend Integration

To integrate this API into a frontend application, use a library like `axios` or `fetch` to send POST requests and display the resulting balance.

**Example Code**:
```javascript
async function getBalance(address) {
  const response = await fetch("http://localhost:3001/get_balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  const data = await response.json();
  if (data.error) {
    console.error("Error:", data.error);
  } else {
    console.log(`USDT Balance for ${data.address}: ${data["USDT balance"]}`);
  }
}
```

## Monitoring and Logging

Set up monitoring tools like Prometheus or Datadog to track API performance and log errors. Ensure logs are structured and include relevant information about request status and errors.

## Conclusion

This API is a simple and efficient tool for retrieving ERC20 token balances. By following the deployment steps and enhancements, it can be scaled for production and integrated into a variety of blockchain applications.
