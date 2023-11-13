from connection import cursor, conn
from psycopg2 import Error
import json
import bcrypt

from fastapi import APIRouter, Response, Request, HTTPException, status
from fastapi.responses import JSONResponse
from controllers.schemas import *


router = APIRouter()


@router.post("/user/create_profile", response_model=None)
async def create_profile(body: LoginInput):
    
    try:
        email = body.email
        username = body.email
        password = encrypt_password(body.password)
        print(email, username, password)
        
        fname = ''
        lname = ''
        phone_number = ''
        about = ''
        sql = '''INSERT INTO Profile(email, username, password, fname, lname, phone_number, about) VALUES (%s, %s, %s, %s, %s, %s, %s);'''
        data = (email, username, password, fname, lname, phone_number, about)
        a = cursor.execute(sql, data)
        print("WOOOOW", a)
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
                         "message": "Internal Server Easdasdsrror"}
            )


    

@router.post("/create_profile_friends/")
async def create_profile_friends():
    try:
        user_id = request.POST['user_id']
        friend_id = request.POST['friend_id']
        sql = "INSERT INTO ProfileFriends(user_id, friend_id) VALUES (%d, %d);"
        data = (int(user_id), int(friend_id))
        cursor.execute(sql, data)
        conn.commit()
        redirect('/') # redirect somewhere on success 
    
    except Error as e:
        print("Unable to create db entry", e)
        return "Error creating db entry"

@router.post("/create_profile_course/")
async def create_profile_course():
    try:
        user_id = request.POST['user_id']
        course_id = request.POST['course_id']
        sql = "INSERT INTO ProfileCourse(user_id, friend_id) VALUES (%d, %d);"
        data = (int(user_id), int(course_id))
        cursor.execute(sql, data)
        conn.commit()
        redirect('/') # redirect somewhere on success 
    
    except Error as e:
        print("Unable to create db entry", e)
        return "Error creating db entry"
    
"""
DB Retrieval Endpoints
"""
# Log in
@router.get("/user/get_login")
async def get_login(email: str, password: str):
    try:
        
        # Gets form data
        #email = str(request.GET['email'])
        #password = str(request.GET['password'])

        # Gets users from database
        sql = 'SELECT password FROM Profile WHERE email = %s'
        cursor.execute(sql,(email,)) # maybe make these 4 lines a function to modularize later
        result = cursor.fetchone()

        # If no user exists
        if(not result):
            print("No user exists")
            raise HTTPException(status_code=404, detail="Item not found")

        # If user exists
        else:
            # Success
            if compare_password(password, result[0]):
                print("Success")
                return {"email": email}

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
                         "message": "Internal Server Easdasdsrror"}
            )


@router.get("/get_profile/")
async def get_profile():
    try:
        email = request.POST['email']
        password = request.POST['password'] # handle encrypt later
        sql = '''SELECT * FROM Profile WHERE email = %s AND password = %s;'''
        data = (email, password)
        cursor.execute(sql, data) # maybe make these 4 lines a function to modularize later
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = [dict(zip(column_names, row)) for row in result]
        return json.dumps(out)
    
        # Login logic I made then realized this is just for retrieving data whoops
        # print(result)
        # if not result:
        #     return redirect('/') # redirect to failed login page
        # else:
        #     column_names = [desc[0] for desc in cursor.description]
        #     out = [dict(zip(column_names, row)) for row in result]
        #     session['profile'] = out
        #     session.save()
        #     # session.delete() for logout
        #     return redirect('/display_data') # redirect to successful login page
    except Error as e:
        print("Unable to get db entry", e)
        return "Error retrieving from db"

@router.get("/get_profile_friends/")
async def get_profile_friends():
    try:
        user_id = request.POST['user_id']
        sql = '''SELECT * FROM ProfileFriends WHERE user_id = %d;'''
        data = (user_id,)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = [dict(zip(column_names, row)) for row in result]
        return json.dumps(out)
    
    except Error as e:
        print("Unable to get db entry", e)
        return "Error retrieving from db"

@router.get("/get_profile_course/")
async def get_profile_course():
    try:
        user_id = request.POST['user_id']
        sql = '''SELECT * FROM ProfileCourse WHERE user_id = %d;'''
        data = (user_id,)
        cursor.execute(sql, data)
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        out = [dict(zip(column_names, row)) for row in result]
        return json.dumps(out)
    
    except Error as e:
        print("Unable to get db entry", e)
        return "Error retrieving from db"


def encrypt_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf8')


def compare_password(password, hashed_password):
    return bcrypt.hashpw(password.encode('utf8'), hashed_password.encode('utf8')) == hashed_password.encode('utf8')