# backend/test_auth.py
import requests
import json

BASE_URL = 'http://localhost:5000'

def test_register():
    url = f'{BASE_URL}/api/auth/register'
    data = {
        'name': 'Test User New',
        'email': 'testuser@example.com',
        'password': 'password123',
        'role': 'user'
    }
    
    response = requests.post(url, json=data)
    print(f"Register Status: {response.status_code}")
    print(f"Register Response: {response.json()}")
    return response

def test_login():
    url = f'{BASE_URL}/api/auth/login'
    data = {
        'email': 'andreea2.p.3@gmail.com',
        'password': 'admin123'
    }
    
    response = requests.post(url, json=data)
    print(f"Login Status: {response.status_code}")
    print(f"Login Response: {response.json()}")
    return response

if __name__ == '__main__':
    print("Testing authentication...")
    test_register()
    print("---")
    test_login()