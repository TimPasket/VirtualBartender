from flask import request, make_response, jsonify,Blueprint
import zcatalyst_sdk
from markupsafe import escape

from randomDrink import randomDrink
# from searchDrink import searchDrink

drinks = Blueprint('drinks', __name__)
drinks.register_blueprint(randomDrink)
# drinks.register_blueprint(searchDrink)

@drinks.route('/', methods=['GET'])
def allDrinks():
  app = zcatalyst_sdk.initialize(req=request)
  search = app.zcql();
  allDrinks = search.execute_query('SELECT ROWID,drinkID, picSrc, name,instructions FROM drinks')
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
    