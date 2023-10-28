from tg import expose, TGController, request, redirect
from connection import cursor, conn
from psycopg2 import Error

class CourseController(TGController):
    """
    DB Creation Endpoints
    """
    @expose(content_type='application/json')
    def create_course(self):
        try:
            code = request.POST['code']
            title = request.POST['title']
            description = request.POST['description']

            sql = "INSERT INTO Course(code, title, description) VALUES (%s, %s, %s);"
            data = (code, title, description)

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
    @expose(content_type='application/json')
    def create_course_professor(self):
        try:
            course_id = request.POST['course_id']
            name = request.POST['name']

            sql = "INSERT INTO CourseProfessor(course_id, name) VALUES (%d, %s);"
            data = (int(course_id), name)

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"
    
    @expose(content_type='application/json')
    def create_course_document(self):
        try:
            course_id = request.POST['course_id']
            document_id = request.POST['document_id']

            sql = "INSERT INTO CourseDoucment(course_id, document_id) VALUES (%d, %d);"
            data = (int(course_id), int(document_id))

            cursor.execute(sql, data)
            conn.commit()
            redirect('/') # redirect somewhere on success 
        
        except Error as e:
            print("Unable to create db entry", e)
            return "Error creating db entry"