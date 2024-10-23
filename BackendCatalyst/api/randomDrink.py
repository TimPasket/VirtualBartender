import logging
from flask import request, make_response, jsonify, Blueprint, abort
import zcatalyst_sdk
from requests import get

randomDrink = Blueprint('randomDrink', __name__)
@randomDrink.route('/random')
def random():
        
    def ingredientParser(apiResponse): 
        count = 1
        ingredientList = []
        measureList = []
        ingredientObject = []
        while apiResponse['strIngredient'+str(count)] is not None:
            ingredientObject.append({'ingredientName': apiResponse['strIngredient'+str(count)], 'ingredientMeasure':apiResponse['strMeasure'+str(count)] })
            ingredientList.append(apiResponse['strIngredient'+str(count)])
            measureList.append(apiResponse['strMeasure'+str(count)])
            count +=1
        return ingredientObject

    def addNewIngredients(ingredientList, search, datastore):
        ingredientRowIDs = []
        measureList = []
        print(f'inputArg - {ingredientList}')
        for ing in ingredientList:
            measureList.append(ing['ingredientMeasure'])
            ingredientResponse = search.execute_query(f"SELECT * FROM ingredients WHERE name=\'{ing['ingredientName']}\'")
            print(f'Ingredient response: {ingredientResponse}')
            if len(ingredientResponse)==0:
                print(f'res NOT > 0')
                newIngResponse =  datastore.table('ingredients').insert_row({"name":ing['ingredientName']})
                ingredientRowIDs.append(newIngResponse)
            else: 
                print(f'res > 0')
                ingredientRowIDs.append(ingredientResponse[0]['ingredients'])
        print(ingredientRowIDs)
        return {"ingredientRows":ingredientRowIDs, 'ingredientMeasures': measureList}

    def addToReferenceTable(drinkID, parsedIngredients, datastore):
        referenceTable = datastore.table('drink_ingredients')
        tableRows = [{'drinkID':drinkID, 'ingredientID':parsedIngredients['ingredientRows'][index]['ROWID'], 'measure':parsedIngredients['ingredientMeasures'][index]} for index in range(len(parsedIngredients['ingredientRows']))]
        insertManyRes= referenceTable.insert_rows(tableRows)
        return insertManyRes
        
    app = zcatalyst_sdk.initialize(req=request)
    search = app.zcql()
    datastore = app.datastore()
    drinkTable = datastore.table('drinks')
    logger = logging.getLogger()

    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    drinkData = randomDrink.json()['drinks'][0]
    ifDataExists = search.execute_query('SELECT * FROM drinks WHERE drinkID = '+drinkData['idDrink'])
    if(len(ifDataExists)==0):
        localDrinkData = drinkData
        drinkDetails = {'name': drinkData['strDrink'], 'drinkID': drinkData['idDrink'],'instructions':drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb'] }
        newRow = drinkTable.insert_row(drinkDetails)
        parsedIngredients = ingredientParser(localDrinkData)
        drinkDetails['ingredientStuff'] = parsedIngredients
        newIngredients = addNewIngredients(parsedIngredients, search, datastore)
        addedToReferenceTable = addToReferenceTable(newRow['ROWID'], newIngredients, datastore)
        
        response = make_response(jsonify({
            'status': 'success',
            'drink': drinkDetails
        }), 200)
        return response
    else: 
        drinkData = ifDataExists[0]['drinks']
        drinkDetails = {'name':drinkData['name'], 'instructions':drinkData['instructions'], 'picSrc':drinkData['picSrc']}
        response = make_response(jsonify({
        'status': 'sucess',
        'drink': drinkDetails,
        # 'ingredientParser': ingredientParser,
        }), 200)
        return response