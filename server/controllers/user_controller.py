from tg import expose, TGController, request, redirect, session, response
from connection import cursor, conn
from psycopg2 import Error
import json
import bcrypt

def encrypt_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf8')


def compare_password(password, hashed_password):
    return bcrypt.hashpw(password.encode('utf8'), hashed_password.encode('utf8')) == hashed_password.encode('utf8')

class UserController(TGController):
    def _before(self, *remainder, **params):
        response.headers.update({'Access-Control-Allow-Origin': '*'})
        response.headers.update({"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"})
    """
    DB Creation Endpoints
    """
    @expose(content_type='application/json')
    def create_profile(self):
        try:
            if request.method == "OPTIONS":
                return 'OK'

            body = request.json_body
            email = body['email']
            username = body['email']
            password = encrypt_password(body['password'])
            fname = ''
            lname = ''
            phone_number = ''
            about = ''

            sql = '''INSERT INTO Profile(email, username, password, fname, lname, phone_number, about) 
VALUES (%s, %s, %s, %s, %s, %s, %s);'''
            data = (email, username, password, fname, lname, phone_number, about)

            cursor.execute(sql, data)
            conn.commit()
            print("Success")
            response.status = 200

        except Error as e:
            print("Unable to create db entry", e)
            response.status = 500
        return response
    
    @expose(content_type='application/json')
    def create_profile_friends(self):
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
    
    @expose(content_type='application/json')
    def create_profile_course(self):
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
    @expose(content_type='application/json')
    def get_login(self):
        try:
            if request.method == "OPTIONS":
                return 'OK'
            
            # Gets form data
            email = str(request.GET['email'])
            password = str(request.GET['password'])
            
            # Gets users from database
            sql = 'SELECT password FROM Profile WHERE email = %s'
            cursor.execute(sql,(email,)) # maybe make these 4 lines a function to modularize later
            result = cursor.fetchone()



            # If no user exists
            if(not result):
                print("No user exists")
                response.status = 500

            # If user exists
            else:
                if compare_password(password, result[0]):
                    print("Success")
                    response.status = 200
                else:
                    print("Wrong password")
                    response.status = 500

            return response

            
            response.status = 500
            return response.status
        except Error as e:
            print("Unable to serach for db entry", e)
            response.status = 500
            return response.status



    @expose(content_type='application/json')
    def get_profile(self):
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
    
    @expose(content_type='application/json')
    def get_profile_friends(self):
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
    
    @expose(content_type='application/json')
    def get_profile_course(self):
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