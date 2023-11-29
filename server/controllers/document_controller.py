from connection import cursor, conn
from psycopg2 import Error, Binary
import bcrypt

from fastapi import APIRouter, Response, Request, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse
from controllers.schemas import *
from typing import Annotated

from controllers.auth import has_access

router = APIRouter()

user_dependency = Annotated[dict, Depends(has_access)]

"""
DB Creation Endpoints
"""
@router.post("/document/create_document", response_model=None)
async def create_document(body: DocumentInput):
    try:
        title = body.title
        author_id = body.author_id
        size = body.size
        content = body.content
        general_access = body.general_access
        # Binary file reading not tested yet
        sql = '''INSERT INTO Document(title, author_id, size, content, general_access) 
VALUES (%s, %d, %d, %s, %d);'''
        data = (title, int(author_id), int(size), Binary(content.file.read()), int(general_access))

        cursor.execute(sql, data)
        conn.commit()
        return {'title': title}
        
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/document/create_permitted_users", response_model=None)
async def create_permitted_users(body: DocumentPermittedUsersInput):
    try:
        document_id = body.document_id
        user_id = body.user_id

        sql = "INSERT INTO PermittedUsers(document_id, user_id) VALUES (%d, %d);"
        data = (int(document_id), int(user_id))

        cursor.execute(sql, data)
        conn.commit()
        return {'document_id': document_id}
        
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/document/create_document_category", response_model=None)
async def create_document_category(body: DocumentCategoryInput):
    try:
        document_id = body.document_id
        name = body.name

        sql = "INSERT INTO DocumentCategory(document_id, name) VALUES (%d, %s);"
        data = (int(document_id), name)

        cursor.execute(sql, data)
        conn.commit()
        return {'document_id': document_id}
        
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )
    
"""
DB Retrieval Endpoints
"""
# @router.get("/document/get_document/")
# async def get_document(user_id: int):
#     try:
#         sql = '''SELECT * FROM Document WHERE author_id = %d;'''
#         data = (user_id,)
#         cursor.execute(sql, data)
#         result = cursor.fetchall()
#         column_names = [desc[0] for desc in cursor.description]
#         out = {i : elm for i, elm in enumerate([dict(zip(column_names, row)) for row in result])}
#         return out
    
#     except Error as e:
#         print("Unable to serach for db entry", e)
#         return JSONResponse(
#                 status_code=500,
#                 content={
#                          "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
#                          "message": "Internal Server Error"}
#             )

# @router.get("/document/get_permitted_users/")
# async def get_permitted_users(document_id: int):
#     try: # can update sql query to just get ids later
#         sql = '''SELECT * FROM PermittedUsers WHERE document_id = %d;'''
#         data = (document_id,)
#         cursor.execute(sql, data)
#         result = cursor.fetchall()
#         column_names = [desc[0] for desc in cursor.description]
#         out = {i : elm for i, elm in enumerate([dict(zip(column_names, row)) for row in result])}
#         return out
    
#     except Error as e:
#         print("Unable to serach for db entry", e)
#         return JSONResponse(
#                 status_code=500,
#                 content={
#                          "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
#                          "message": "Internal Server Error"}
#             )     

@router.get("/document/get_document_category/")
async def get_document_category(user: user_dependency, document_id: int = Header(None, convert_underscores=False)):
    try:
        sql = '''SELECT name FROM DocumentCategory WHERE document_id = %s;'''
        data = (document_id,)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = {i : elm for i, elm in enumerate([dict(zip(column_names, row)) for row in result])}
        return out
    
    except Error as e:
        print("Unable to serach for db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )