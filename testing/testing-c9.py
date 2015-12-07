import webbrowser,json,httplib
connection = httplib.HTTPConnection('0.0.0.0',8080)
headers = {'Content-Type': 'application/json'}
connection.connect()
connection.request("POST","/login/",json.dumps({
    "USERNAME": "TESTUSER2",
    "MAIL":"testuser2@mail.com",
    "PASSWORD":"123"})
    ,headers)

results = connection.getresponse().read()
print results

