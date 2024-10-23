import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk
import json
'''
Execute below command to install SDK in global for enabling code suggestions
-> python3 -m pip install zcatalyst-sdk
'''
def addUsr(usr, datastore):
    print("hey there")
    newUsr = datastore.table('users').insert_row(usr)
    return newUsr
    
def checkUsr(usr, search):
    # searchConfig = {
    #     'search':'users*',
    #     'search_table_columns':{
    #         'email':usr['email'],
    #         'hashPwd':usr['hashPwd']
    #     }
    # }
    print(usr)
    temp = "SELECT * FROM users WHERE email='Nope@gmail.com'"
    zcql = f"SELECT * FROM users WHERE email= \'{usr['email']}\' AND hashPwd= \'{usr['hashPwd']}\'"
    # usrExists = search.execute_search_query(searchConfig)
    loginUsr = search.execute_query(temp)
    print(loginUsr)
    return loginUsr[0]

def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    datastore = app.datastore()
    search = app.zcql()
    logger = logging.getLogger()
    usr = request.args.get("usr")
    usr = json.loads(usr)
    if request.path == "/signup":
        newUsr = addUsr(usr, datastore)
        response = make_response(jsonify({
            'status': 'success',
            'newUsr': newUsr
        }), 200)
        return response
    elif request.path == "/login":
        loginUsr = checkUsr(usr, search)
        print(loginUsr)
        response = make_response(jsonify({
            'status': 'success',
            'loginUsr':loginUsr,
        }),200)
    else:
        response = make_response('Unknown path')
        response.status_code = 400
        return response
