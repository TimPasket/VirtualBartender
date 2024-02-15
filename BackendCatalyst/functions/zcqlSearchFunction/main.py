import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk
from requests import get

def ingredientParser(apiResponse): 
    ingredientList = []
    count = 1
    while apiResponse['strIngredient'+str(count)] is not None:
        ingredientList.append({apiResponse['strIngredient'+str(count)]: apiResponse['strMeasure'+str(count)]})
        count +=1
    return ingredientList


def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    search = app.zcql()
    datastore = app.datastore()
    function_service = app.functions()    
    drinkTable = datastore.table('drinks')
    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    drinkData = randomDrink.json()['drinks'][0]
    drinkName = drinkData['strDrink']
    #'drinkInstructions':drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb']
    #'drinkInstructions':drinkData['strInstructions']
    ifDataExists = search.execute_query('SELECT * FROM drinks WHERE drinkID = '+drinkData['idDrink'])
    amarettoRose = search.execute_query('SELECT * FROM drinks WHERE drinkID = 11027')
    logger = logging.getLogger()
    if request.path == "/" and ifDataExists is not None:
        newDrink = {'name': drinkData['strDrink'], 'drinkID': drinkData['idDrink'],'instructions':drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb'] }
        newRow = drinkTable.insert_row(newDrink)
        
        response = make_response(jsonify({
            'status': 'success',
            'ifDataExists': ifDataExists is None,
            'newRow': newRow
        }), 200)
        return response
    elif request.path == '/rose' and amarettoRose is not None:
        functionResponse = ingredientParser(drinkData)
        # ingredientParser = function_service.execute(1922000000021679, args)
        response = make_response(jsonify({
            'status': 'sucess',
            'drink': amarettoRose,
            'functionResponse': functionResponse
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
