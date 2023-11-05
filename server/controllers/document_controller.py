from tg import expose, TGController, request, redirect
from connection import cursor, conn
from psycopg2 import Error, Binary
import json

class DocumentController(TGController):
    """
    DB Creation Endpoints
    """
    @expose(content_type='application/json')
    def create_document(self):
        try:
            title = request.POST['title']
            author_id = request.POST['author_id']
            size = request.POST['size']
            content = request.POST['content']
            general_access = request.POST['general_access']

            sql = '''INSERT INTO Document(title, author_id, size, content, general_access) 
VALUES (%s, %d, %d, %s, %d);'''
            data = (title, int(author_id), int(size), Binary(content), int(general_access))

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
    @expose(content_type='application/json')
    def create_permitted_users(self):
        try:
            document_id = request.POST['document_id']
            user_id = request.POST['user_id']

            sql = "INSERT INTO PermittedUsers(document_id, user_id) VALUES (%d, %d);"
            data = (int(document_id), int(user_id))

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
    @expose(content_type='application/json')
    def create_document_category(self):
        try:
            document_id = request.POST['document_id']
            name = request.POST['name']

            sql = "INSERT INTO DocumentCategory(document_id, name) VALUES (%d, %s);"
            data = (int(document_id), name)

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
    """
    DB Retrieval Endpoints
    """
    @expose(content_type='application/json')
    def get_document(self):
        try:
            user_id = request.POST['user_id'] # other options for getting documents can come later

            sql = '''SELECT * FROM Document WHERE author_id = %d;'''
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
    def get_permitted_users(self):
        try:
            document_id = request.POST['document_id']

            sql = '''SELECT * FROM PermittedUsers WHERE document_id = %d;'''
            data = (document_id,)

            cursor.execute(sql, data)
            result = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            out = [dict(zip(column_names, row)) for row in result]

            return json.dumps(out)

        except Error as e:
            print("Unable to get db entry", e)
            return "Error retrieving from db"

    @expose(content_type='application/json')
    def get_document_category(self):
        try:
            document_id = request.POST['document_id']

            sql = '''SELECT * FROM DocumentCategory WHERE document_id = %d;'''
            data = (document_id,)

            cursor.execute(sql, data)
            result = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            out = [dict(zip(column_names, row)) for row in result]

            return json.dumps(out)

        except Error as e:
            print("Unable to get db entry", e)
            return "Error retrieving from db"