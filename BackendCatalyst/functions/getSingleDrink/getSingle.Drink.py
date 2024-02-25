from flask import Request, make_response, jsonify
import zcatalyst_sdk

def reformatResponse(dataResponse):
    drinkData= dataResponse[0]['d']
    properResponse = {"drinkName": drinkData['name'], 'picSrc': drinkData['picSrc'], 'instructions': drinkData['instructions']}
    ingredientStuff = []
    for rec in dataResponse:
        ingredientStuff.append({"ingredientName":rec['i']['name'], "ingredientMeasure":rec['di']['measure']})
    properResponse["ingredientStuff"] = ingredientStuff
    return properResponse

def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    search = app.zcql()
    drinkData = search.execute_query('SELECT d.*, i.name, di.measure FROM drinks d INNER JOIN drink_ingredients di ON d.ROWID = di.drinkID INNER JOIN ingredients i ON di.ingredientID = i.ROWID WHERE d.ROWID = '+request.args.get("ID"))
    
    if request.path == "/" and len(drinkData) > 0:
        responseData = reformatResponse(drinkData)
        response = make_response(jsonify({
            'status': 'success',
            'data': responseData
        }), 200)
        return response
    else:
        response = make_response('Drink does not exist')
        response.status_code = 404
        return response
