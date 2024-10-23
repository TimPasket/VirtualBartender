import logging
from flask import request, make_response, jsonify, Blueprint,abort
import zcatalyst_sdk
from requests import get

searchDrink = Blueprint('searchDrink', __name__)
@searchDrink.route('/search')
def searchDrink():
  
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
  
  if request.args.get("toggleValue") == 'false':
    #Searching by Drink name
    searchDrinks = get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+request.args.get("searchQuery"))
    drinkList = searchDrinks.json()['drinks']
    responseList = []
    for drink in drinkList:
      ifDataExists = search.execute_query(f"SELECT * FROM drinks WHERE drinkID = \'{drink['idDrink']}\'")
      if(len(ifDataExists)==0):    
        drinkDetails = {'name': drink['strDrink'], 'instructions': drink['strInstructions'], 'picSrc': drink['strDrinkThumb'], 'drinkID':drink['idDrink']}
        newRow = drinkTable.insert_row(drinkDetails)
        ingredientDetails = ingredientParser(drink)
        drinkDetails['ingredientStuff'] = ingredientDetails
        drinkDetails['ROWID'] = newRow['ROWID']
        newIngredients = addNewIngredients(ingredientDetails, search, datastore)
        addedToReferenceTable = addToReferenceTable(newRow['ROWID'], newIngredients, datastore)
        responseList.append(drinkDetails)
      else: 
        drinkData = ifDataExists[0]['drinks']
        drinkDetails = {'name':drinkData['name'], 'instructions':drinkData['instructions'], 'picSrc':drinkData['picSrc'],'ROWID':drinkData['ROWID']}
        responseList.append(drinkDetails)
    response = make_response(jsonify({
      "status": "success",
      'drinks': responseList
    }),200)
    return response
  
  elif request.args.get("toggleValue") == 'true':
    #Searching by Ingredient name
    searchDrinks = get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+request.args.get("searchQuery"))
    drinkList = searchDrinks.json()['drinks']
    responseList = []
    for drink in drinkList:
      ifDataExists = search.execute_query(f"SELECT * FROM drinks WHERE drinkID = \'{drink['idDrink']}\'")
      if(len(ifDataExists)==0):
        apiDetails = get('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+drink['idDrink'])    
        apiDetails = apiDetails.json()['drinks'][0]
        drinkDetails = {'name': apiDetails['strDrink'], 'instructions': apiDetails['strInstructions'], 'picSrc': apiDetails['strDrinkThumb'], 'drinkID': apiDetails['idDrink']}
        print(f'drinkDetails: \n{drinkDetails}')
        newRow = drinkTable.insert_row(drinkDetails)
        ingredientDetails = ingredientParser(apiDetails)
        drinkDetails['ingredientStuff'] = ingredientDetails
        drinkDetails['ROWID'] = newRow['ROWID']
        newIngredients = addNewIngredients(ingredientDetails, search, datastore)
        addedToReferenceTable = addToReferenceTable(newRow['ROWID'], newIngredients, datastore)
        responseList.append(drinkDetails)
      else: 
        drinkData = ifDataExists[0]['drinks']
        drinkDetails = {'name':drinkData['name'], 'instructions':drinkData['instructions'], 'picSrc':drinkData['picSrc'],'ROWID':drinkData['ROWID'], 'drinkID':drinkData['drinkID']}
        responseList.append(drinkDetails)
    response = make_response(jsonify({
      "status": "success",
      'drinks': responseList
    }),200)
    return response
