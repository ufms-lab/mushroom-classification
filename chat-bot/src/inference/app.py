from io import BytesIO
from PIL import Image
import requests

from classifier import MushroomClassifier

classifier = MushroomClassifier()

def handler(event, context):
    print('[Started] Mushroom Classification!')

    result = requests.get(event['picture'])
    img = Image.open(BytesIO(result.content))

    mushroomClass = classifier(img)
    print('result: ', mushroomClass)


    print('[Finished] Mushroom Classification!')
    return {
        'statusCode': 200,
        'body': mushroomClass
    }
