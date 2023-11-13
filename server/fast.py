from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from controllers import user_controller_fast
import uvicorn

app = FastAPI()
app.include_router(user_controller_fast.router)

'''
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8080/user/create_profile",
]
'''

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}



if __name__ == "__main__":
    uvicorn.run(app, host = "localhost", port = 8080, log_level='debug', access_log=True)