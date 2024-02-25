import logging
import zcatalyst_sdk
import json
from requests import get

def addNewIngredients(ingredientList, search, datastore):
    ingredientRowIDs = []
    measureList = []
    print(f'inputArg - {ingredientList}')
    for ing in ingredientList:
        measureList.append(ing['ingredientMeasure'])
        ingredientResponse = search.execute_query(f'SELECT * FROM ingredients WHERE name=\"{ing["ingredientName"]}\"')
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
    insertManyRes = referenceTable.insert_rows(tableRows)
    return insertManyRes


def handler(event, context):
    app = zcatalyst_sdk.initialize()
    search = app.zcql()
    cacheValue = event.get_data()['cache_value']
    drinkDetails = json.loads(cacheValue)
    ifDrinkExists = search.execute_query(f'SELECT * FROM drinks WHERE drinkID = \"{drinkDetails["drinkID"]}\"')
    if len(ifDrinkExists) == 0:
        localSearch = search
        datastore = app.datastore()
        drinkTable = datastore.table('drinks')
        newDrink = {'name': drinkDetails['name'], 'drinkID': drinkDetails['drinkID'],'instructions':drinkDetails['instructions'], 'picSrc': drinkDetails['picSrc'] }
        newRow = drinkTable.insert_row(newDrink)
        newIngredients = addNewIngredients(drinkDetails['ingredientStuff'], localSearch, datastore)
        addedToReferenceTable = addToReferenceTable(newRow['ROWID'], newIngredients, datastore)
        logging.info("we gucci")
        context.close_with_success()
        
    else:
        logging.info(f'Drink exists\nID: {ifDrinkExists[0]["ROWID"]}\nName:{ifDrinkExists[0]["name"]}')
        context.close_with_success()
        
    # logger.info(data['cache_value'])
    # time = event.get_time()  # event occurred time
    # action = event.get_action()
    # source_details = event.get_source()
    # source_entity_id = event.get_source_entity_id()
    # event_bus_details = event.get_event_bus_details()
    # project_details = event.get_project_details()

    '''Context Functionalities'''
    # remaining_execution_time_ms = context.get_remaining_execution_time_ms()
    # max_execution_time_ms = context.get_max_execution_time_ms()
    # context.close_with_failure()
