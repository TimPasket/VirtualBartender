import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk


def handler(request: Request):
    if request.path == "/":
        
        print(request)
        
        response = make_response({
            'status': 'success',
            'message': 'Hello from ingredientParser.py'
        }, 200)
        return response
    else:
        response = make_response('Unknown path')
        response.status_code = 400
        return response
