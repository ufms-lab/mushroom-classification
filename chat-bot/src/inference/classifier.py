from io import BytesIO
from PIL import Image

import torch
import torchvision.transforms as transforms
import numpy as np

from torchvision.models.shufflenetv2 import shufflenet_v2_x2_0
import boto3

s3_client = boto3.client("s3")

class MushroomClassifier:
  def __init__(self) -> None:
    self.classes = [
      "Amanita gemmata",
      "Amanita muscaria",
      "Amanita pantherina",
      "Amanita phalloides",
      "Clathrus archeri",
      "Coprinellus disseminatus",
      "Coprinus comatus",
      "Entoloma hochstetteri",
      "Filoboletus manipularis",
      "Fomes fomentarius",
      "Gyromitra esculenta",
      "Hericium erinaceus",
      "Hydnellum peckii",
      "Ileodictyon cibarium",
      "Lepiota cristata",
      "Morchella esculenta",
      "Phallus indusiatus",
      "Psilocybe cubensis",
      "Psilocybe semilanceata",
      "Trametes versicolor"
    ]

    self.transform = transforms.Compose(
      [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
      ]
    )

    self.device = torch.device("cpu")

    file_content = s3_client.get_object(Bucket='mushroom-classification-models', Key='model_pretreined_shufflenet_v2_x2_0.pth')["Body"].read()

    modelTrained = torch.load(BytesIO(file_content), map_location=self.device)

    self.model = shufflenet_v2_x2_0()
    number_of_features = self.model.fc.in_features
    self.model.fc = torch.nn.Linear(number_of_features, len(self.classes))
    self.model.load_state_dict(modelTrained["model"])

  @staticmethod
  def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

  def __call__(self, telegram_picture: Image.Image) -> str:
    self.model.eval()
    data = self.transform(telegram_picture)
    data = data.unsqueeze(0)
    with torch.no_grad():
      data = data.to(self.device)

      pred = self.model(data)


      m = MushroomClassifier.softmax(pred.tolist()[0])

      arr = np.array(m)
      matches = arr.argsort()[-3:][::-1]

      result = self.classes[matches[0]] + ' - ' + format(m[matches[0]]*100, '.2f') + '%'

      if (m[matches[1]]*100 > 10):
        result += '\n' + self.classes[matches[1]] + ' - ' + format(m[matches[1]]*100, '.2f') + '%'

      if (m[matches[2]]*100 > 10):
        result += '\n' + self.classes[matches[2]] + ' - ' + format(m[matches[2]]*100, '.2f') + '%'

    return result
