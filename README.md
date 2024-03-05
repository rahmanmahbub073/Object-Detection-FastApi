# Install

```shell
python -m venv env
pip install -r requirements.txt -i 
```

# RUN

* Modify MODEL_SERVER_IP and MODEL_SERVER_PORT value as model server in server.py.
  > Default MODEL_SERVER_IP and MODEL_SERVER_PORT is self interface, just used test.



* Run server
```shell
uvicorn server:app
```
