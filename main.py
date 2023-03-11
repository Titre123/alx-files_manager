import requests

# x = requests.post('http://127.0.0.1:5000/users', data={ "email": "bob@dylan.com", "password": "toto1234!" })
x = requests.get('http://127.0.0.1:5000/connect', headers= {"Authorization" : "Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="})
# x = requests.get('http://127.0.0.1:5000/users/me', headers= {"X-Token": "9d2cb14d-779c-423c-9d1a-339415b3d34d"})
# x = requests.get('http://127.0.0.1:5000/disconnect', headers= {"X-Token" : "9d2cb14d-779c-423c-9d1a-339415b3d34d"})
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "images", "type": "folder" }, headers= {"X-Token": "774b8870-72be-4d7f-b5db-5c0eb3625b4e"})
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==", "parentId": "640c42dcbc99a21b3c9f2c0a"}, headers= {"X-Token": "b0d82afd-61d2-4ba1-b368-80d370283c58"})
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "images", "type": "folder", "parentId": "640c42dbbc99a21b3c9f2c09" }, headers= {"X-Token": "774b8870-72be-4d7f-b5db-5c0eb3625b4e"})

print(x.text)