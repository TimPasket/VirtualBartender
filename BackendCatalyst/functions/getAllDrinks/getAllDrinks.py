import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk

def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    logger = logging.getLogger()
    search = app.zcql();
    allDrinks = search.execute_query('SELECT ROWID, picSrc, name,instructions FROM drinks')
    if request.path == "/":
        response = make_response(jsonify({
            'status': 'success',
            'data': allDrinks
        }), 200)
        return response
    else:
        response = make_response('Unknown path')
        response.status_code = 400
        return response
