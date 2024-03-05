# ObjectDetectionFastApi
Download the Repo and Extract it
# Install

```shell
python -m venv env
cd /env/Scripts
activate env
back to root directory "server" {cd ../} one step back
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

# RUN

* Modify MODEL_SERVER_IP and MODEL_SERVER_PORT value as model server in server.py.
  > Default MODEL_SERVER_IP and MODEL_SERVER_PORT is self interface, just used test.



* Run server
```shell
uvicorn server:app
```
