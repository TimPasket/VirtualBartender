import os
from flask import Flask, request,make_response,jsonify
#Blueprints below
# from randomDrink import randomDrink
from drinks import drinks


app = Flask(__name__)
app.register_blueprint(drinks, url_prefix='/drinks')
# app.register_blueprint(randomDrink, url_prefix='/drink')

@app.route('/')
def hello():
    if request.path == "/":
        print(app.url_map)
        response = make_response(jsonify({
      'status': 'success',
      'hello': 'there'
    }))
    return response
@app.route('/sdk')
def sdk():
    try:      
        import zcatalyst_sdk as zcatalyst
        zcat = zcatalyst.initialize(req=request)
        cache_resp = zcat.cache().segment().put('Key', 'value')
        return cache_resp, 200
    except Exception as e:
        return 'Got exception: ' + repr(e)\

if __name__ == '__main__':
    listen_port = int(os.getenv('X_ZOHO_CATALYST_LISTEN_PORT', 9000))
    app.run(host="0.0.0.0", port=listen_port)