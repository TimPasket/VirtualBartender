import logging
from flask import Request, make_response, jsonify
import zcatalyst_sdk
from requests import get

def ingredientParser(apiResponse): 
    count = 1
    ingredientList = []
    measureList = []
    ingredientObject= []
    while apiResponse['strIngredient'+str(count)] is not None:
        ingredientObject.append({'ingredientName': apiResponse['strIngredient'+str(count)], 'ingredientMeasure':apiResponse['strMeasure'+str(count)] })
        ingredientList.append(apiResponse['strIngredient'+str(count)])
        measureList.append(apiResponse['strMeasure'+str(count)])
        count +=1
    return ingredientObject


def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    logger = logging.getLogger()    
    
    if request.path == "/random":
        randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        drinkData = randomDrink.json()['drinks'][0]
        ingredientDetails = ingredientParser(drinkData)
        drinkDetails = {'name': drinkData['strDrink'], 'instructions': drinkData['strInstructions'], 'picSrc': drinkData['strDrinkThumb'], 'ingredientStuff': ingredientDetails, 'drinkID': drinkData['idDrink']}
        drinkSegment = app.cache().segment(1922000000017975)

        insert_resp = drinkSegment.put('randomDrink', drinkDetails,1)
        logger.info('Inserted cache : ' + str(insert_resp))
        
        response = make_response(jsonify({
            'status': 'success',
            'drink': drinkDetails
        }), 200)
        return response
    elif request.path == "/searchDrink":
        searchDrinks = get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+request.args.get("searchQuery"))
        drinkList = searchDrinks.json()['drinks']
        responseList = []
        for drink in drinkList:
            ingredientDetails = ingredientParser(drink)
            drinkDetails = {'name': drink['strDrink'], 'instructions': drink['strInstructions'], 'picSrc': drink['strDrinkThumb'], 'ingredientStuff': ingredientDetails, 'drinkID': drink['idDrink']}
            drinkSegment = app.cache().segment(1922000000017975)
            insert_resp = drinkSegment.put('Drink', drinkDetails,1)
            responseList.append(drinkDetails)
        response = make_response(jsonify({
            "status": "success",
            'drinks': responseList
        }),200)
        return response
    elif request.path == "/searchIngredient":
        print("ingredient")