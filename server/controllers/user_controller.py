from connection import cursor, conn
from psycopg2 import Error
import bcrypt

from fastapi import APIRouter, Response, Request, HTTPException, status, Depends, Header, File, Form, UploadFile
from fastapi.responses import JSONResponse
from controllers.schemas import *
from typing import Annotated
import base64

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
        picture = None

        print(email, username, password)
        
        # Check if user exists already
        sql = '''SELECT * FROM profile WHERE email = %s;'''
        cursor.execute(sql,(str(email),)) 
        result = cursor.fetchone()
        if(result):
            print("User already exists")
            raise HTTPException(status_code=404, detail="User already exists")

        # Inserts user
        sql = '''INSERT INTO Profile(email, username, password, fname, lname, phone_number, about, profile_picture) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);'''
        data = (email, username, password, fname, lname, phone_number, about, picture)
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
async def create_profile_friends(user: user_dependency, body: FriendInput):
    try:
        # Retrieve friend ID
        sql = '''SELECT user_id FROM Profile WHERE email = %s;'''
        cursor.execute(sql,(str(body.friend_email),)) 
        result = cursor.fetchone()
        # If no friend user exists
        if (not result):
            print("No user exists")
            raise HTTPException(status_code=404, detail="Item not found")

        friend_id = int(result[0])
        user_id = body.user_id

        # Check if friend pair already exists
        sql = '''select * from profilefriends where (user_id = %s and friend_id = %s)'''
        data = (user_id, friend_id)
        a = cursor.execute(sql, data)
        result = cursor.fetchone()
        if (result):
            print("Friend pairing already exists")
            raise HTTPException(status_code=404, detail="Friend pairing already exists")


        # Add user and friend to list
        sql = "INSERT INTO ProfileFriends(user_id, friend_id) VALUES (%s, %s);"
        data = (user_id, friend_id)
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
                return {"token": token, "user_id": result[0]}

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
@router.get("/user/get_profile/")
async def get_profile(user: user_dependency):
    try:
        email = user.get('username')
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
            column_names = [desc[0] for desc in cursor.description]
            out = dict(zip(column_names, result))
            del out["password"] # leave out password
            #del out["profile_picture"]

            #out["profile_picture"] = bytes(out["profile_picture"])
            print(type(out["profile_picture"]))
            if(out["profile_picture"] != None):
                out["profile_picture"] = out["profile_picture"].tobytes()
            sql = '''SELECT * FROM profilefriends WHERE user_id = %s;'''
            cursor.execute(sql,(out['user_id'],)) 
            result = cursor.fetchall()

            out["numFriends"] = len(result)


            return out
    except Error as e:
        print("Unable to serach for db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

@router.get("/user/get_profile_friends/")
async def get_profile_friends(user: user_dependency, user_id:int):
    try:
        user_id = user_id
        # Gets friends id and name
        sql = '''select user_id as id, profile_picture as pfp, CONCAT(fname || ' ' || lname) as name from profile where user_id in 
        (select friend_id from profilefriends where user_id = %s)'''
        data = (user_id,)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = [dict(zip(column_names, row)) for row in result]


        # Changes all friend profiles to bytes
        for i in out:
            if(i["pfp"] != None):
                i["pfp"] = i["pfp"].tobytes()

        # Gets mutual courses
        for i in out:
            print(i['id'])
            sql = ''' select title 
            from course 
            natural join(
                select course_id, count(user_id) from profilecourse
                where user_id = %s or user_id = %s
                group by course_id
                having count (user_id) > 1)'''

            data = (user_id, i["id"])
            cursor.execute(sql, data)
            result = [r[0] for r in cursor.fetchall()]
            if(len(result) > 0):
                i["shared_courses"] = result
            else:
                i["shared_courses"] = []




        return out
  
    except Error as e:
        print("Unable to serach for db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

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

"""
DB Edit Endpoints
"""
@router.delete("/user/delete_profile_course/")
async def delete_permitted_user(user: user_dependency, course_id: int = Header(None, convert_underscores=False)):
    email = user.get('username')
    try:
        sql = '''DELETE FROM ProfileCourse
WHERE course_id = %s AND user_id = (
    SELECT user_id FROM Profile WHERE email = %s
);'''
        data = (course_id, email)
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

@router.delete("/user/delete_friend/")
async def delete_friend(user: user_dependency, body: DeleteFriendInput):
    try:
        user_id = body.user_id
        friend_id = body.friend_id
        sql = '''DELETE FROM profilefriends
        WHERE (user_id = %s and friend_id = %s);'''
        data = (user_id, friend_id)
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

@router.put("/user/delete_profile_picture/")
async def delete_profile_picture(user: user_dependency, body: DeletePfpInput):
    try:
        user_id = body.user_id
        sql = '''UPDATE profile
        SET profile_picture = NULL
        WHERE user_id = %s;'''
        data = (user_id, )
        cursor.execute(sql, data)
        conn.commit()

        return {"status":"Deleted profile picture"}
    
    except Error as e:
        print("Unable to update db entry", e)
        return JSONResponse(
                status_code=500,
                content={
                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                         "message": "Internal Server Error"}
            )

#
#@router.put("/user/update_profile/")
#async def update_document(user: user_dependency, body: ProfileUpdateInput):
#    try:
#        user_id = body.user_id
#        new_email = body.new_email
#        phone_num = body.phone_num
#        about_me = body.about_me
#
#        sql = '''UPDATE profile SET email = %s, username = %s, phone_number = %s, about = %s WHERE user_id = %s'''
#        data = (new_email, new_email, phone_num, about_me, user_id)
#        cursor.execute(sql, data)
#        conn.commit()
#
#        token = await create_access_token(new_email)
#        return {"token": token, "user_id": user_id}
#
#    except Error as e:
#        print("Unable to update db entry", e)
#        conn.rollback()
#        return JSONResponse(
#                status_code=500,
#                content={
#                         "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
#                         "message": "Internal Server Error"}
#            )

@router.put("/user/update_profile/")
async def update_document(user: user_dependency, body: ProfileUpdateInput):
    try:
        user_id = body.user_id
        new_email = body.new_email
        phone_num = body.phone_num
        about_me = body.about_me
        profile_picture = body.profile_picture
        profile_picture_bytes = str.encode(profile_picture)

        #print(profile_picture)


        sql = '''UPDATE profile SET email = %s, username = %s, phone_number = %s, about = %s, profile_picture = %s WHERE user_id = %s'''
        data = (new_email, new_email, phone_num, about_me, profile_picture_bytes, user_id)
        cursor.execute(sql, data)
        conn.commit()
#
        token = await create_access_token(new_email)
        return {"token": token, "user_id": user_id}
#
    except Error as e:
        print("Unable to update db entry", e)
        conn.rollback()
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

    