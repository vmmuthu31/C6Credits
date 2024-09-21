from flask import Flask, request, jsonify
from flask_cors import CORS  
import requests
import traceback 
from moralis import evm_api
import time
import traceback


app = Flask(__name__)

CORS(app)
MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjYzNzk2YjUxLThiZWMtNGViMy1iZDliLWFlMzAwODdlYTA5OSIsIm9yZ0lkIjoiMzIxMzAyIiwidXNlcklkIjoiMzMwMzI4IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiJiOTA0MTM0MC0xYTJlLTRjMjYtYmI2Yi05NTMzODMyNjE1ZGEiLCJpYXQiOjE3MjY4NjM0ODYsImV4cCI6NDg4MjYyMzQ4Nn0.0qY0cvIajgOJ9fJD-APOwPNxDxR4cftfF-8m5myDW9Q"

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
            if e.status == 429: 
                print(f"Rate limit exceeded. Retrying in {backoff_in_seconds ** (attempt + 1)} seconds...")
                time.sleep(backoff_in_seconds ** (attempt + 1)) 
            else:
                raise e
    raise Exception("Max retries reached. Could not fetch the data.")


@app.route('/approve/transaction', methods=['GET'])
def get_transaction_approval():
    try:
        token_address = request.args.get('tokenAddress')

        if not token_address:
            return jsonify({"error": "tokenAddress is required"}), 400

        print(f"Token Address: {token_address}")

        api_url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction"
        request_options = {
            "headers": {
                "Authorization": AUTH_TOKEN
            },
            "params": {
                "tokenAddress": token_address,
            }
        }

        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        print("Exception occurred: ", str(e))
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500


@app.route('/approve/allowance', methods=['GET'])
def get_allowance_approval():
    try:
        token_address = request.args.get('tokenAddress')
        wallet_address = request.args.get('walletAddress')

        if not token_address or not wallet_address:
            return jsonify({"error": "Both tokenAddress and walletAddress are required"}), 400

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

        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

    print(headers, params, "Request Headers and Params")
    
    try:
        response = requests.get(api_url, headers=headers, params=params)
        
        print(f"Request Params: {params}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 429:
            print("Rate limit exceeded. Please try again later.")
            return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

        try:
            response_data = response.json()
            print(f"Response Data: {response_data}")
        except requests.exceptions.JSONDecodeError:
            print("Failed to parse JSON response (empty body or invalid response).")
            return jsonify({"error": "Invalid response from the 1inch API."}), 500

        if response.status_code == 400:
            print("Returned 400 from 1inch API...")
            return jsonify(response_data), 400

        return jsonify(response_data), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"Request to 1inch API failed: {str(e)}")
        print(f"Request Params: {params}")
        print(f"Request Headers: {headers}")
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        traceback.print_exc()  
        return jsonify({"error": "Internal Server Error"}), 500
            
@app.route('/approve/allowance', methods=['GET'])
def get_allowance():
    try:
        token_address = request.args.get('tokenAddress')
        wallet_address = request.args.get('walletAddress')

        if not token_address or not wallet_address:
            return jsonify({"error": "Both tokenAddress and walletAddress are required"}), 400

        print(f"Token Address: {token_address}")
        print(f"Wallet Address: {wallet_address}")

        api_url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction"
        request_options = {
            "headers": {
                "Authorization": AUTH_TOKEN
            },
            "params": {
                "tokenAddress": token_address,
                "amount": 1  
            }
        }

        response = requests.get(api_url, headers=request_options["headers"], params=request_options["params"])

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": f"Failed to fetch data from 1inch API. Status code: {response.status_code}",
                            "details": response.text}), response.status_code

    except Exception as e:
        print("Exception occurred: ", str(e))
        traceback.print_exc() 
        return jsonify({"error": "An error occurred"}), 500

@app.route('/tokenPrice', methods=['GET'])
def token_price():
    address_one = request.args.get('addressOne')
    address_two = request.args.get('addressTwo')

    if not address_one or not address_two:
        return jsonify({"error": "Both addressOne and addressTwo parameters are required"}), 400

    try:
        print(f"Fetching token price for addressOne: {address_one}")
        response_one = fetch_with_retry(evm_api.token.get_token_price, {"address": address_one})

        print(f"Fetching token price for addressTwo: {address_two}")
        response_two = fetch_with_retry(evm_api.token.get_token_price, {"address": address_two})

        print("Response One:", response_one)
        print("Response Two:", response_two)

        if 'usdPrice' not in response_one or 'usdPrice' not in response_two:
            return jsonify({"error": "Failed to retrieve USD prices for tokens."}), 500

        usd_prices = {
            "tokenOne": response_one['usdPrice'],
            "tokenTwo": response_two['usdPrice'],
            "ratio": response_one['usdPrice'] / response_two['usdPrice']
        }

        return jsonify(usd_prices), 200

    except Exception as e:
        print("Exception occurred: ", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "UP"}), 200

if __name__ == '__main__':
    app.run(port=3001, host='0.0.0.0')
