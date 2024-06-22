import zcatalyst_sdk

def handler(context, basicio):
    getUser = zcatalyst_sdk.initialize().authentication().get_current_user()
    basicio.write(str(getUser))
    basicio.get_argument('name')

    context.log('Successfully executed basicio function')
    context.close()
