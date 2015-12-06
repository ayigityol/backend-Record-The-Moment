import webbrowser,json,httplib
connection = httplib.HTTPConnection('0.0.0.0',8080)
connection.connect()
connection.request("GET","/")

results = connection.getresponse().read()
print results

