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


def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    logger = logging.getLogger()
    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    drinkData = randomDrink.json()['drinks'][0]
    ingredientDetails = ingredientParser(drinkData)
    drinkDetails = {'name': drinkData['strDrink'], 'instructions': drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb'], 'ingredientStuff': ingredientDetails, 'drinkID': drinkData['idDrink']}
    
    if request.path == "/":
        randomDrinkSegment = app.cache().segment(1922000000017975)

        insert_resp = randomDrinkSegment.put('randomDrink', drinkDetails,1)
        logger.info('Inserted cache : ' + str(insert_resp))
        
        response = make_response(jsonify({
            'status': 'success',
            'drink': drinkDetails
        }), 200)
        return response