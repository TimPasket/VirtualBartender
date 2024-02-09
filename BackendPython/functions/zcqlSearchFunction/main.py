import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk
from requests import get

def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    search = app.zcql()
    datastore = app.datastore()
    testTable = datastore.table(1922000000007048)
    
    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    
    drinkName = randomDrink.json()['drinks'][0]['strDrink']
    drinkId = randomDrink.json()['drinks'][0]['idDrink']
    newDrink = {'name': drinkName, 'numberData': int(drinkId)}
    # ifDataExists = search.execute_query('SELECT * FROM testTable')
    logger = logging.getLogger()
    if request.path == "/":
        responseObject = randomDrink.json()
        responseObject['newData'] = testTable.insert_row(newDrink)
        response = make_response(jsonify({
            'status': 'success',
            'response': responseObject
        }), 200)
        return response
    elif request.path == "/cache":
        default_segment = app.cache().segment()

        insert_resp = default_segment.put('Name', 'DefaultName')
        logger.info('Inserted cache : ' + str(insert_resp))
        get_resp = default_segment.get('Name')

        return jsonify(get_resp), 200
    else:
        response = make_response('Unknown path')
        response.status_code = 400
        return response
