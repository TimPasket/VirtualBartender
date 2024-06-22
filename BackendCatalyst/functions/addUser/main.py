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
    
def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    datastore = app.datastore()
    logger = logging.getLogger()
    usr = request.args.get("usr")
    usr = json.loads(usr)
    if request.path == "/":
        newUsr = addUsr(usr, datastore)
        response = make_response(jsonify({
            'status': 'success',
            'newUsr': newUsr
        }), 200)
        return response
    else:
        response = make_response('Unknown path')
        response.status_code = 400
        return response
