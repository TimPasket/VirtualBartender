import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk
from requests import get


def ingredientParser(apiResponse): 
    count = 1
    ingredientList = []
    measureList = []
    while apiResponse['strIngredient'+str(count)] is not None:
        ingredientList.append(apiResponse['strIngredient'+str(count)])
        measureList.append(apiResponse['strMeasure'+str(count)])
        count +=1
    return {'ingredients': ingredientList, 'measures':measureList}

def addNewIngredients(ingredientList, search, datastore):
    ingredientRowIDs = []
    print(ingredientList)
    for ing in ingredientList['ingredients']:
        ingredientResponse = search.execute_query(f'SELECT * FROM ingredients WHERE name=\'{ing}\'')
        print(f'Ingredient response: {ingredientResponse}')
        if len(ingredientResponse)==0:
            print(f'res > 0')
            newIngResponse =  datastore.table('ingredients').insert_row({"name":ing})
            ingredientRowIDs.append(newIngResponse)
        else: 
            print(f'res NOT > 0')
            ingredientRowIDs.append(ingredientResponse[0]['ingredients'])
    print(ingredientRowIDs)
    return {"ingredientRows":ingredientRowIDs, 'ingredientMeasures': ingredientList['measures']}

def addToReferenceTable(drinkID, parsedIngredients, datastore):
    referenceTable = datastore.table('drink_ingredients')
    tableRows = [{'drinkID':drinkID, 'ingredientID':parsedIngredients['ingredientRows'][index]['ROWID'], 'measure':parsedIngredients['ingredientMeasures'][index]} for index in range(len(parsedIngredients['ingredientRows']))]
    insertManyRes= referenceTable.insert_rows(tableRows)
    return insertManyRes
    
    
def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    search = app.zcql()
    datastore = app.datastore()
    
    drinkTable = datastore.table('drinks')
    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    drinkData = randomDrink.json()['drinks'][0]
    drinkName = drinkData['strDrink']
    #'drinkInstructions':drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb']
    #'drinkInstructions':drinkData['strInstructions']
    ifDataExists = search.execute_query('SELECT * FROM drinks WHERE drinkID = '+drinkData['idDrink'])
    amarettoRose = search.execute_query('SELECT * FROM drinks WHERE drinkID = 11027')
    logger = logging.getLogger()
    
    
    if request.path == "/random" and len(ifDataExists) == 0:
        newDrink = {'name': drinkData['strDrink'], 'drinkID': drinkData['idDrink'],'instructions':drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb'] }
        newRow = drinkTable.insert_row(newDrink)
        parsedIngredients = ingredientParser(drinkData)
        newIngredients = addNewIngredients(parsedIngredients, search, datastore)
        addedToReferenceTable = addToReferenceTable(newRow['ROWID'], newIngredients, datastore)
        
        response = make_response(jsonify({
            'status': 'success',
            'ifDataExists': ifDataExists,
            'newRow': newRow,
            'ingredients': parsedIngredients,
            'addedToReferenceTable':addedToReferenceTable,
        }), 200)
        return response
    elif request.path == '/random' and len(ifDataExists) != 0:
        # ingredientParser = function_service.execute(1922000000021679, args)
        response = make_response(jsonify({
            'status': 'sucess',
            'drink': ifDataExists,
            # 'ingredientParser': ingredientParser,
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
