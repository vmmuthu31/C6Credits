from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle CORS
import requests
import traceback  # For debugging
from moralis import evm_api
import time
import traceback


app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjYzNzk2YjUxLThiZWMtNGViMy1iZDliLWFlMzAwODdlYTA5OSIsIm9yZ0lkIjoiMzIxMzAyIiwidXNlcklkIjoiMzMwMzI4IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiJiOTA0MTM0MC0xYTJlLTRjMjYtYmI2Yi05NTMzODMyNjE1ZGEiLCJpYXQiOjE3MjY4NjM0ODYsImV4cCI6NDg4MjYyMzQ4Nn0.0qY0cvIajgOJ9fJD-APOwPNxDxR4cftfF-8m5myDW9Q"

# Authorization token for 1inch API
AUTH_TOKEN = "Bearer uzF2lXeO9pYtpjthDs0ltrkVwDcup6bd"

def fetch_with_retry(api_function, params, retries=5, backoff_in_seconds=2):
    """Fetches data from Moralis API with retry and exponential backoff."""
    for attempt in range(retries):
        try:
            response = api_function(
                api_key=MORALIS_API_KEY,
                params=params
            )
            return response
        except evm_api.exceptions.ApiException as e:
            if e.status == 429:  # If rate limit is exceeded
                print(f"Rate limit exceeded. Retrying in {backoff_in_seconds ** (attempt + 1)} seconds...")
                time.sleep(backoff_in_seconds ** (attempt + 1))  # Exponential backoff
            else:
                raise e
    raise Exception("Max retries reached. Could not fetch the data.")


# Route to get transaction approval
@app.route('/approve/transaction', methods=['GET'])
def get_transaction_approval():
    try:
        # Retrieve query parameters from the URL
        token_address = request.args.get('tokenAddress')

        # Validate that the required parameters are provided
        if not token_address:
            return jsonify({"error": "tokenAddress is required"}), 400

        # Print the tokenAddress to the console
        print(f"Token Address: {token_address}")

        # Prepare the API request for 1inch
        api_url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction"
        request_options = {
            "headers": {
                "Authorization": AUTH_TOKEN
            },
            "params": {
                "tokenAddress": token_address,
            }
        }

        # Make the request to 1inch API
        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        # If the request is successful
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            # Handle error from 1inch API
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        print("Exception occurred: ", str(e))
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500


# Route to get allowance approval
@app.route('/approve/allowance', methods=['GET'])
def get_allowance_approval():
    try:
        # Get the tokenAddress and walletAddress from the URL query parameters
        token_address = request.args.get('tokenAddress')
        wallet_address = request.args.get('walletAddress')

        # Validate that both tokenAddress and walletAddress are provided
        if not token_address or not wallet_address:
            return jsonify({"error": "Both tokenAddress and walletAddress are required"}), 400

        # Prepare the API request for 1inch
        api_url = "https://api.1inch.dev/swap/v6.0/1/approve/allowance"
        request_options = {
            "headers": {
                "Authorization": AUTH_TOKEN
            },
            "params": {
                "tokenAddress": token_address,
                "walletAddress": wallet_address
            }
        }

        # Make the request to the 1inch API
        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        # If the request is successful, return the JSON response
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            # Handle error from 1inch API
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        # Handle any exceptions that occur
        return jsonify({"error": str(e)}), 500

### 1inch API - Swap Route
@app.route('/swap', methods=['GET'])
def swap():
    api_url = "https://api.1inch.dev/swap/v6.0/1/swap"
    from_token_address = request.args.get('fromTokenAddress')
    to_token_address = request.args.get('toTokenAddress')
    amount = request.args.get('amount')
    from_address = request.args.get('fromAddress')
    slippage = request.args.get('slippage')

    request_options = {
        "headers": {
            "Authorization": AUTH_TOKEN
        },
        "params": {
            "src": from_token_address,
            "dst": to_token_address,
            "amount": amount,
            "from": from_address,
            "origin": from_address,
            "slippage": slippage
        }
    }

    headers = request_options.get("headers", {})
    params = request_options.get("params", {})

    print(headers, params, "Request Headers and Params")  # Log headers and params

    try:
        # Make the request to the 1inch API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Log the full request and response for debugging
        print(f"Request Params: {params}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        
        # Check if the response status is 429 (rate limit)
        if response.status_code == 429:
            print("Rate limit exceeded. Please try again later.")
            return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

        # Try parsing the response if the status is not 429 and not empty
        try:
            response_data = response.json()
            print(f"Response Data: {response_data}")
        except requests.exceptions.JSONDecodeError:
            print("Failed to parse JSON response (empty body or invalid response).")
            return jsonify({"error": "Invalid response from the 1inch API."}), 500

        # Check if the response has a 400 Bad Request error
        if response.status_code == 400:
            print("Returned 400 from 1inch API...")
            return jsonify(response_data), 400

        # If response is successful, return the response
        return jsonify(response_data), response.status_code

    except requests.exceptions.RequestException as e:
        # Log the exception details
        print(f"Request to 1inch API failed: {str(e)}")
        print(f"Request Params: {params}")
        print(f"Request Headers: {headers}")
        traceback.print_exc()  # Print the stack trace for deeper debugging
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        # Catch all exceptions to see if there's something we're missing
        print(f"An unexpected error occurred: {str(e)}")
        traceback.print_exc()  # Print the stack trace for deeper debugging
        return jsonify({"error": "Internal Server Error"}), 500
            
### 1inch API - Approve/Allowance Route
@app.route('/approve/allowance', methods=['GET'])
def get_allowance():
    try:
        # Retrieve query parameters from the URL
        token_address = request.args.get('tokenAddress')
        wallet_address = request.args.get('walletAddress')

        # Validate that the required parameters are provided
        if not token_address or not wallet_address:
            return jsonify({"error": "Both tokenAddress and walletAddress are required"}), 400

        # Print the tokenAddress and walletAddress to the console
        print(f"Token Address: {token_address}")
        print(f"Wallet Address: {wallet_address}")

        # Prepare the API request for 1inch
        api_url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction"
        request_options = {
            "headers": {
                "Authorization": AUTH_TOKEN
            },
            "params": {
                "tokenAddress": token_address,
                "amount": 1  # Assuming you meant amount/walletAddress
            }
        }

        # Make the request to 1inch API
        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        # If the request is successful
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            # Handle error from 1inch API
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        print("Exception occurred: ", str(e))
        traceback.print_exc()  # Print the full stack trace for debugging
        return jsonify({"error": "An error occurred"}), 500

@app.route('/tokenPrice', methods=['GET'])
def token_price():
    # Get query parameters
    address_one = request.args.get('addressOne')
    address_two = request.args.get('addressTwo')

    # Validate that both addresses are provided
    if not address_one or not address_two:
        return jsonify({"error": "Both addressOne and addressTwo parameters are required"}), 400

    try:
        # Get token prices for the provided token addresses with retry and backoff
        print(f"Fetching token price for addressOne: {address_one}")
        response_one = fetch_with_retry(evm_api.token.get_token_price, {"address": address_one})

        print(f"Fetching token price for addressTwo: {address_two}")
        response_two = fetch_with_retry(evm_api.token.get_token_price, {"address": address_two})

        # Log the responses for debugging
        print("Response One:", response_one)
        print("Response Two:", response_two)

        # Ensure both responses contain usdPrice
        if 'usdPrice' not in response_one or 'usdPrice' not in response_two:
            return jsonify({"error": "Failed to retrieve USD prices for tokens."}), 500

        # Calculate the prices and the ratio
        usd_prices = {
            "tokenOne": response_one['usdPrice'],
            "tokenTwo": response_two['usdPrice'],
            "ratio": response_one['usdPrice'] / response_two['usdPrice']
        }

        return jsonify(usd_prices), 200

    except Exception as e:
        # Log the error and the stack trace
        print("Exception occurred: ", str(e))
        traceback.print_exc()  # Print the full stack trace to the console
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "UP"}), 200

if __name__ == '__main__':
    app.run(port=3001, host='0.0.0.0')

# http://localhost:3001/approve/allowance?tokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&walletAddress=0xB022BDdd12168BaaB3022E87500d2C71E8109264
# http://localhost:3001/swap?fromTokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&toTokenAddress=0x514910771af9ca656af840dff83e8264ecf986ca&amount=1000000&fromAddress=0xB022BDdd12168BaaB3022E87500d2C71E8109264&slippage=2.5
