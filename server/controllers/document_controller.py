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
async def create_document(user: user_dependency, body: DocumentInput):
    try:
        print("body", body)
        title = body.title
        author_id = body.author_id
        # size = body.size
        content = body.content
        general_access = body.general_access
        course_id = body.course_id
        # Binary file reading not tested yet
        print(content)
        sql = '''INSERT INTO Document(title, author_id, content, general_access) 
VALUES (%s, %s, %s, %s) RETURNING document_id;'''
        data = (title, int(author_id), content, int(general_access))

        cursor.execute(sql, data)
        document_id = cursor.fetchone()[0]
        conn.commit()

        sql = '''INSERT INTO CourseDocument(course_id, document_id) VALUES (%s, %s)'''
        data = (int(course_id), int(document_id))
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
async def create_permitted_users(user: user_dependency, body: DocumentPermittedUsersInput):
    try:
        document_id = body.document_id
        email = body.email

        sql = '''INSERT INTO PermittedUsers (document_id, user_id)
VALUES (
    %s,
    (SELECT user_id FROM Profile WHERE email = %s)
) ON CONFLICT (document_id, user_id) DO NOTHING;'''
        data = (document_id, email)

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

@router.get("/document/get_permitted_users/")
async def get_permitted_users(user: user_dependency, document_id: int = Header(None, convert_underscores=False)):
    try: 
        email = user.get('username')
        sql = '''SELECT P.user_id, P.email, P.fname, P.lname
FROM PermittedUsers PU
JOIN Profile P ON PU.user_id = P.user_id
WHERE PU.document_id = %s
  AND PU.user_id <> (SELECT user_id FROM Profile WHERE email = %s);'''
        data = (document_id, email)
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

@router.get("/document/get_public_documents/")
async def get_public_documents(user: user_dependency):
    try:
        email = user.get('username')
        sql = '''SELECT
    D.document_id,
    D.title,
    D.author_id,
    (SELECT fname FROM Profile WHERE user_id = D.author_id) AS first_name,
    (SELECT lname FROM Profile WHERE user_id = D.author_id) AS last_name,
    D.general_access,
    (SELECT code FROM Course WHERE course_id = (SELECT course_id FROM CourseDocument WHERE document_id = D.document_id)) AS course_code,
    (SELECT title FROM Course WHERE course_id = (SELECT course_id FROM CourseDocument WHERE document_id = D.document_id)) AS course_title
FROM
    Document D
WHERE
    D.general_access = 1;'''
        cursor.execute(sql)
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

@router.get("/document/get_document/")
async def get_document(user: user_dependency, Document_id: int = Header(None, convert_underscores=False)):
    try:
        sql = '''SELECT * FROM document WHERE document_id = %s;'''
        data = (Document_id,)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = {i : elm for i, elm in enumerate([dict(zip(column_names, row)) for row in result])}
        out[0]['content'] = bytes(out[0]['content']).decode('utf-8')
        data = out[0]['content']
        return out[0]
    
    except Error as e:
        print("Unable to serach for db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )


"""
DB Edit Endpoints
"""

@router.put("/document/update_document/")
async def update_document(user: user_dependency, body: DocumentUpdateInput, Document_id: int = Header(None, convert_underscores=False)):
    try:
        title = body.title,
        content = body.content,
        general_access = body.general_access
        sql = '''UPDATE document SET title = %s, content = %s, general_access = %s WHERE document_id = %s'''
        data = (title, content, general_access, Document_id)
        cursor.execute(sql, data)
        conn.commit()
        return {Document_id: Document_id}
    except Error as e:
        print("Unable to update db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.delete("/document/delete_document/")
async def delete_document(user: user_dependency, Document_id: int = Header(None, convert_underscores=False), Course_id: int = Header(None, convert_underscores=False)):
    try:
        sql = '''DELETE FROM CourseDocument WHERE course_id = %s AND document_id = %s'''
        data = (Course_id, Document_id)
        cursor.execute(sql, data)
        conn.commit()

        sql = '''DELETE FROM PermittedUsers WHERE document_id = %s'''
        data = (Document_id,)
        cursor.execute(sql, data)
        conn.commit()
        
        sql = '''DELETE FROM Document WHERE document_id = %s'''
        data = (Document_id,)
        cursor.execute(sql, data)
        conn.commit()

        return {"status":"Deleted"}
    
    except Error as e:
        print("Unable to update db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.delete("/document/delete_permitted_user/")
async def delete_permitted_user(user: user_dependency, user_id: int = Header(None, convert_underscores=False), document_id: int = Header(None, convert_underscores=False)):
    try:
        sql = '''DELETE FROM PermittedUsers
WHERE user_id = %s and document_id = %s'''
        data = (user_id, document_id)
        cursor.execute(sql, data)
        conn.commit()

        return {"status":"Deleted"}
    
    except Error as e:
        print("Unable to update db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )