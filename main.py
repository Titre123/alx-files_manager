import requests

# x = requests.post('http://127.0.0.1:5000/users', data={ "email": "bob@dylan.com", "password": "toto1234!" })
# x = requests.get('http://127.0.0.1:5000/connect', headers= {"Authorization" : "Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="})
# x = requests.get('http://127.0.0.1:5000/users/me', headers= {"X-Token": "9d2cb14d-779c-423c-9d1a-339415b3d34d"})
# x = requests.get('http://127.0.0.1:5000/disconnect', headers= {"X-Token" : "9d2cb14d-779c-423c-9d1a-339415b3d34d"})
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "images", "type": "folder" }, headers= {"X-Token": "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==", "parentId": "640fb108900ea037fcd72708"}, headers= {"X-Token": "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})
# print(x.text)
# x = requests.post('http://127.0.0.1:5000/files', data= { "name": "images", "type": "folder", "parentId": "640c42dbbc99a21b3c9f2c09" }, headers= {"X-Token": "774b8870-72be-4d7f-b5db-5c0eb3625b4e"})
# x = requests.get('http://127.0.0.1:5000/files/640fb190900ea037fcd7270e', headers= {"X-Token" : "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})
# print(x.text)
# x = requests.put('http://127.0.0.1:5000/files/640fb190900ea037fcd7270e/publish', headers= {"X-Token" : "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})

# x = requests.put('http://127.0.0.1:5000/files/640cd9836d80e526bd4a2c88/unpublish', headers= {"X-Token" : "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})

x = requests.get('http://127.0.0.1:5000/files/640fb190900ea037fcd7270e/data', headers= {"X-Token" : "e8e0eb80-f213-4577-aedb-1b44aafdfd59"})
print(x.text)