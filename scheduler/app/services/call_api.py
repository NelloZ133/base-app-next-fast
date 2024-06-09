import requests


def call_backend(method: str, url: str, data: dict | list, api_key: str = None):
    headers = (
        {"Accept": "application/json"}
        if api_key is None
        else {"X-API-KEY": api_key, "Accept": "application/json"}
    )
    if method == "GET":
        response = requests.get(url=url, headers=headers)
    elif method == "POST":
        response = requests.post(url=url, headers=headers, json=data)
    elif method == "PUT":
        response = requests.put(url=url, headers=headers, json=data)
    elif method == "DELETE":
        response = requests.delete(url=url, headers=headers)
    return response
