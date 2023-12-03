from fastapi.templating import Jinja2Templates
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile, File, Request
import numpy as np
from keras.models import load_model
from io import BytesIO
from PIL import Image


app = FastAPI()

origins = [
    "http://localhost",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "Access-Control-Allow-Origin",
                   "Access-Control-Allow-Methods", "X-Requested-With",
                   "Authorization", "X-CSRF-Token"]
)

templates = Jinja2Templates(directory="html")
app.mount("/static", StaticFiles(directory="static"), name="static")

model = load_model('model/model.h5')


@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/ml/")
async def upload_photo(photo: UploadFile = File(...)):
    contents = await photo.read()
    image = Image.open(BytesIO(contents)).convert("L")
    image = np.expand_dims(np.array(image), axis=2) / 255.0
    image = np.expand_dims(image, axis=0)
    prediction = model.predict(image)
    digit = np.argmax(prediction)
    return {"predicted_digit": int(digit)}
