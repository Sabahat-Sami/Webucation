from connection import cursor, conn
from psycopg2 import Error
import bcrypt

from fastapi import APIRouter, Response, Request, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse
from controllers.schemas import *
from typing import Annotated

from controllers.auth import has_access, create_access_token

router = APIRouter()

# TO ADD A TOKEN DEPENDENCY, ADD USER_DEPENDENCY TO PARAMETERS
# EX. async def some_method(user: user_dependency, email: str, password: str):

user_dependency = Annotated[dict, Depends(has_access)]

"""
DB Creation Endpoints
"""
@router.post("/user/create_profile", response_model=None)
async def create_profile(body: SignupInput):
    
    try:
        if(body.password != body.confirmPassword):
            print("Passwords do not match")
            raise HTTPException(status_code=404, detail="Passwords do not match")

        email = body.email
        username = body.email
        password = encrypt_password(body.password)
        fname = body.fname
        lname = body.lname
        phone_number = body.phone_num
        about = ''

        print(email, username, password)
        

        sql = '''INSERT INTO Profile(email, username, password, fname, lname, phone_number, about) VALUES (%s, %s, %s, %s, %s, %s, %s);'''
        data = (email, username, password, fname, lname, phone_number, about)
        a = cursor.execute(sql, data)
        conn.commit()
        print("Success")
        return {"email": email}

    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/user/create_profile_friends/", response_model=None)
async def create_profile_friends(body: FriendInput):
    try:
        user_id = body.user_id
        friend_id = body.friend_id

        sql = "INSERT INTO ProfileFriends(user_id, friend_id) VALUES (%d, %d);"
        data = (int(user_id), int(friend_id))
        cursor.execute(sql, data)
        conn.commit()
        return {"user_id": user_id}
    
    except Error as e:
        print("Unable to create db entry", e)
        conn.rollback()
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.post("/user/create_profile_course/", response_model=None)
async def create_profile_course(user: user_dependency, body: ProfileCourseInput):
    try:
        email = user.get('username')
        course_id = body.course_id

        sql = '''INSERT INTO ProfileCourse (user_id, course_id)
VALUES (
  (SELECT user_id FROM Profile WHERE email = %s),
  %s
);'''
        data = (email, course_id)
        cursor.execute(sql, data)
        conn.commit()
        return {"email": email, "course_id": course_id, "status": "Success"}
    
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
# Log in
@router.get("/user/log_in")
async def log_in(email: str, password: str):
    try:
        # Gets users from database
        sql = '''SELECT * FROM Profile WHERE email = %s;'''
        cursor.execute(sql,(email,)) 
        result = cursor.fetchone()
        # If no user exists
        if (not result):
            print("No user exists")
            raise HTTPException(status_code=404, detail="Item not found")

        # If user exists
        else:
            # Success
            if compare_password(password, result[3]):
                print("Success")
                # Generate token
                token = await create_access_token(email)
                return {"token": token}

            # Wrong password
            else:
                print("Wrong password")
                raise HTTPException(status_code=404, detail="Item not found")

    except Error as e:
        print("Unable to serach for db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

# Get profile
# @router.get("/user/get_profile/")
# async def get_profile(user: user_dependency):
#     try:
#         email = user.get('username')
#         # Gets users from database
#         sql = '''SELECT * FROM Profile WHERE email = %s;'''
#         cursor.execute(sql,(email,)) 
#         result = cursor.fetchone()
#         # If no user exists
#         if (not result):
#             print("No user exists")
#             raise HTTPException(status_code=404, detail="Item not found")

#         # If user exists
#         else:
#             # Success
#             column_names = [desc[0] for desc in cursor.description]
#             out = dict(zip(column_names, result))
#             del out["password"] # leave out password
#             print(out)

#             return out

#     except Error as e:
#         print("Unable to serach for db entry", e)
#         return JSONResponse(
#                 status_code=500,
#                 content={
#                          "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
#                          "message": "Internal Server Error"}
#             )

# @router.get("/user/get_profile_friends/")
# async def get_profile_friends(user_id: int):
#     try:
#         sql = '''SELECT * FROM ProfileFriends WHERE user_id = %d;'''
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

@router.get("/user/get_user_courses/")
async def get_user_courses(user: user_dependency):
    try:
        email = user.get('username')
        sql = '''SELECT Course.*
FROM Course
WHERE Course.course_id IN (
    SELECT ProfileCourse.course_id
    FROM ProfileCourse
    WHERE ProfileCourse.user_id = (
        SELECT user_id
        FROM Profile
        WHERE email = %s
    )
);'''
        data = (email,)
        print(data)
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

@router.get("/user/get_course_documents/")
async def get_user_course_documents(user: user_dependency, course_id: int = Header(None, convert_underscores=False)):
    try:
        email = user.get('username')

        print(email, course_id)
        sql = '''SELECT 
    D.document_id, 
    D.title, 
    D.author_id, 
    D.size, 
    D.general_access,
    (
        SELECT P.fname
        FROM Profile P
        WHERE P.user_id = D.author_id
        LIMIT 1
    ) AS first_name,
    (
        SELECT P.lname
        FROM Profile P
        WHERE P.user_id = D.author_id
        LIMIT 1
    ) AS last_name
FROM Document D
WHERE D.document_id IN (
    SELECT CD.document_id
    FROM CourseDocument CD, Profile P
    WHERE CD.course_id = %s
    AND P.email = %s
    AND P.user_id = D.author_id
);'''
        data = (course_id, email)
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

@router.get("/user/get_shared_with_me_documents/")
async def get_shared_with_me_documents(user: user_dependency):
    try:
        email = user.get('username')
        sql = '''SELECT
    D.document_id,
    D.title,
    D.author_id,
    (
        SELECT P.fname
        FROM Profile P
        WHERE P.user_id = D.author_id
    ) AS first_name,
    (
        SELECT P.lname
        FROM Profile P
        WHERE P.user_id = D.author_id
    ) AS last_name,
    D.size,
    D.general_access,
    (
        SELECT C.code
        FROM Course C
        WHERE C.course_id = (
            SELECT CD.course_id
            FROM CourseDocument CD
            WHERE CD.document_id = D.document_id
        )
    ) AS course_code,
    (
        SELECT C.title
        FROM Course C
        WHERE C.course_id = (
            SELECT CD.course_id
            FROM CourseDocument CD
            WHERE CD.document_id = D.document_id
        )
    ) AS course_title
FROM
    Document D
WHERE
    D.document_id IN (
        SELECT
            PU.document_id
        FROM
            PermittedUsers PU
        WHERE
            PU.user_id IN (
                SELECT
                    user_id
                FROM
                    Profile
                WHERE
                    email = %s
            )
    )
AND
    D.document_id NOT IN (
        SELECT
            document_id
        FROM
            Document D2
        WHERE
            D2.author_id IN (
                SELECT
                    user_id
                FROM
                    Profile
                WHERE
                    email = %s
            )
    )'''
        data = (email, email)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        print(result)
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

def encrypt_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf8')


def compare_password(password, hashed_password):
    return bcrypt.hashpw(password.encode('utf8'), hashed_password.encode('utf8')) == hashed_password.encode('utf8')

    