import json
from random import randint
from random import random

import aiohttp
from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

class DetectedRequest(BaseModel):
    image: str
    use: bool = True

class ServerTestRequest(BaseModel):
    content: str

async def request_model_server(host, ip, data):
    async with aiohttp.ClientSession() as session:
        headers = {'Content-Type': 'application/json'}
        data = json.dumps({"content": data})
        async with session.post(f"http://{host}:{ip}/model/predict", headers=headers, data=data) as response:
            response = await response.text()
        return json.loads(response)

MODEL_SERVER_IP = '127.0.0.1'
MODEL_SERVER_PORT = '8000'

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')

templates = Jinja2Templates(directory="templates")


@app.get('/')
async def index(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})


@app.post('/detected')
async def detected(request: DetectedRequest):
    if request.use:
        return await request_model_server(MODEL_SERVER_IP, MODEL_SERVER_PORT, request.image)
    return {"code": 200, "data":[]}


@app.post('/model/predict')
async def detected(request: ServerTestRequest):
    x1, y1, x2, y2 = randint(0, 200), randint(0, 200), randint(300, 500), randint(300, 500)
    data = [{"box":[x1, y1, x2, y2], "label": "test", "confidence": '{:.2f}'.format(random())}]
    return {'code': 200, 'data':data}