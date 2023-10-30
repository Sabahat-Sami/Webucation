from tg import expose, TGController, request, redirect
from connection import cursor, conn
from psycopg2 import Error

class UserController(TGController):
    """
    DB Creation Endpoints
    """
    @expose(content_type='application/json')
    def create_profile(self):
        try:
            email = request.POST['email']
            username = request.POST['username']
            password = request.POST['password'] # handle encrypt later
            fname = request.POST['fname']
            lname = request.POST['lname']
            phone_number = request.POST['phone_number']
            about = request.POST['about']

            sql = '''INSERT INTO Profile(email, username, password, fname, lname, phone_number, about) 
VALUES (%s, %s, %s, %s, %s, %s, %s);'''
            data = (email, username, password, fname, lname, phone_number, about)

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 

        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
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