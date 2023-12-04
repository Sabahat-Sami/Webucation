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
@router.post("/course/create_course", response_model=None)
async def create_course(body: CourseInput):
    try:
        code = body.code
        title = body.title
        sql = "INSERT INTO Course(code, title) VALUES (%s, %s) RETURNING course_id;"
        data = (code, title)

        cursor.execute(sql, data)
        inserted_id = cursor.fetchone()[0]
        conn.commit()
        return {'course_id': inserted_id}
        
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/course/create_course_professor", response_model=None)
async def create_course_professor(body: CourseProfessorInput):
    try:
        course_id = body.course_id
        name = body.name

        sql = "INSERT INTO CourseProfessor(course_id, name) VALUES (%d, %s);"
        data = (int(course_id), name)

        cursor.execute(sql, data)
        conn.commit()
        return {'course_id': course_id}
        
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/course/create_course_document", response_model=None)
async def create_course_document(body: CourseDocumentInput):
    try:
        course_id = body.course_id
        document_id = body.document_id

        sql = "INSERT INTO CourseDocument(course_id, document_id) VALUES (%d, %d);"
        data = (int(course_id), int(document_id))

        cursor.execute(sql, data)
        conn.commit()
        return {'course_id': course_id}
        
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
@router.get("/course/get_course/")
async def get_course(user: user_dependency, course_id: int = Header(None, convert_underscores=False)):
    try:
        sql = '''SELECT * FROM Course WHERE course_id = %s;'''
        data = (course_id,)
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

@router.get("/course/find_course/")
async def find_course(user: user_dependency, code: str = Header(None), title: str = Header(None)):
    try:
        sql = '''SELECT * FROM Course WHERE code = %s AND UPPER(title) = UPPER(%s);'''
        data = (code, title)
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
