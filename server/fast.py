from fastapi import FastAPI
from fastapi import APIRouter
from controllers import user_controller_fast


app = FastAPI()
app.include_router(user_controller_fast.router)

if __name__ == "__main__":
    uvicorn.run(app, port = 8080)