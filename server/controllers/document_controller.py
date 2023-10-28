from tg import expose, TGController, request, redirect
from connection import cursor, conn
from psycopg2 import Error, Binary

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