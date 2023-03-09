import requests

# x = requests.post('http://127.0.0.1:5000/users', data={ "email": "bob@dylan.com", "password": "toto1234!" })
# x = requests.get('http://127.0.0.1:5000/connect', headers= {"Authorization" : "Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="})
x = requests.get('http://127.0.0.1:5000/users/me', headers= {"X-Token": "9d2cb14d-779c-423c-9d1a-339415b3d34d"})
# x = requests.get('http://127.0.0.1:5000/disconnect', headers= {"X-Token" : "9d2cb14d-779c-423c-9d1a-339415b3d34d"})

print(x.text)