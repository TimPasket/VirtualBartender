from flask import request, make_response, jsonify,Blueprint
import zcatalyst_sdk
from markupsafe import escape
from requests import get
# import logging
from randomDrink import randomDrink
# from searchDrink import searchDrink

drinks = Blueprint('drinks', __name__)
# drinks.register_blueprint(randomDrink)
# drinks.register_blueprint(searchDrink)

@drinks.route('/', methods=['GET'])
def allDrinks():
  app = zcatalyst_sdk.initialize(req=request)
  search = app.zcql();
  ordering = request.args.get('sortMethod') if request.args.get('sortMethod') == null else "name"
  allDrinks = search.execute_query('SELECT ROWID,drinkID, picSrc, name,instructions FROM drinks ORDER BY '+ordering+' ASC')
  if len(allDrinks) > 0:
    response = make_response(jsonify({
        'status': 'success',
        'count': len(allDrinks),
        'data': allDrinks
    }), 200)
    return response
  else:
    response = make_response(jsonify({
      'status': "Failure",
      'message': 'No data found'
    }), 404)
    return response
    
@drinks.route('/<drinkID>')
def singleDrink(drinkID):
  drinkID = escape(drinkID)
    
  def reformatResponse(dataResponse):
    drinkData= dataResponse[0]['d']
    properResponse = {"drinkName": drinkData['name'], 'picSrc': drinkData['picSrc'], 'instructions': drinkData['instructions'],'ROWID':drinkData['ROWID'],'drinkID':drinkData['drinkID']}
    ingredientStuff = []
    for rec in dataResponse:
        ingredientStuff.append({"ingredientName":rec['i']['name'], "ingredientMeasure":rec['di']['measure']})
    properResponse["ingredientStuff"] = ingredientStuff
    return properResponse

  app = zcatalyst_sdk.initialize(req=request)
  search = app.zcql()
  print(drinkID)
  drinkData = search.execute_query('SELECT d.*, i.name, di.measure FROM drinks d INNER JOIN drink_ingredients di ON d.ROWID = di.drinkID INNER JOIN ingredients i ON di.ingredientID = i.ROWID WHERE d.ROWID = '+drinkID)
  print(drinkData)
  if len(drinkData) > 0:
      responseData = reformatResponse(drinkData)
      response = make_response(jsonify({
          'status': 'success',
          'data': responseData
      }), 200)
      return response
  else:
      response = make_response(jsonify({
          'status': "Error: 404 Not Found",
          'message': "Query returned empty list"
          }), 404)
      response.status_code = 404
      return response
@drinks.route('/search')
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
      'drinks': responseList,
      'count': len(responseList)
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
      'drinks': responseList,
      'count': len(responseList)
    }),200)
    return response
@drinks.route('/random')
def randomDrink():
        
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
    def reformatResponse(dataResponse):
      drinkData= dataResponse[0]['d']
      properResponse = {"name": drinkData['name'], 'picSrc': drinkData['picSrc'], 'instructions': drinkData['instructions'],'ROWID':drinkData['ROWID'],'drinkID':drinkData['drinkID']}
      ingredientStuff = []
      for rec in dataResponse:
          ingredientStuff.append({"ingredientName":rec['i']['name'], "ingredientMeasure":rec['di']['measure']})
      properResponse["ingredientStuff"] = ingredientStuff
      return properResponse
        
    app = zcatalyst_sdk.initialize(req=request)
    search = app.zcql()
    datastore = app.datastore()
    drinkTable = datastore.table('drinks')
    # logger = logging.getLogger()

    randomDrink = get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    drinkData = randomDrink.json()['drinks'][0]
    # ifDataExists = search.execute_query('SELECT * FROM drinks WHERE drinkID = '+drinkData['idDrink'])
    drinkDataRes = search.execute_query('SELECT d.*, i.name, di.measure FROM drinks d INNER JOIN drink_ingredients di ON d.ROWID = di.drinkID INNER JOIN ingredients i ON di.ingredientID = i.ROWID WHERE d.drinkID = '+drinkData['idDrink'])
    print(f'drinkDataRes: ${drinkDataRes}')
    if(len(drinkDataRes)==0):
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
        print(f'drink already exsists')
        # drinkData = ifDataExists[0]['drinks']
        drinkDetails = reformatResponse(drinkDataRes)
        # drinkDetails = {'name':drinkData['name'], 'instructions':drinkData['instructions'], 'picSrc':drinkData['picSrc']}
        response = make_response(jsonify({
        'status': 'sucess',
        'drink': drinkDetails,
        # 'ingredientParser': ingredientParser,
        }), 200)
        return response