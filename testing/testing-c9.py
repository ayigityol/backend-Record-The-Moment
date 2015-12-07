import webbrowser,json,httplib
connection = httplib.HTTPConnection('0.0.0.0',8080)
headers = {'Content-Type': 'application/json'}
connection.connect()
connection.request("POST","/register/",json.dumps({
    "USERNAME": "TESTUSER",
    "MAIL":"testuser@mail.com",
    "PASSWORD":"123"})
    ,headers)

results = connection.getresponse().read()
print results

