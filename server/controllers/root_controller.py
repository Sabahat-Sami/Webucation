from tg import expose, TGController, session, response
from connection import cursor, conn
from controllers.user_controller import UserController
from controllers.document_controller import DocumentController
from controllers.course_controller import CourseController

# RootController of our web app, in charge of serving content for /
class RootController(TGController):
    
    user = UserController()
    document = DocumentController()
    course = CourseController()

    @expose(content_type="text/plain")
    def index(self):
        return 'Hello World'
    
    @expose(content_type='application/json')
    def display_data(self):
        try:
            cursor.execute("SELECT row_to_json(course) FROM course")
            single_row = cursor.fetchone()[0]
            print(single_row)
            return single_row
        except Exception as e:
            print("Unable to retrieve data", e)
            return "Error retrieving data"
    
    @expose(content_type="text/html")
    def test_retrieval(self):
        return '''
        <form action="/user/get_profile" method="post">
            <input type="text" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Password">
            <input type="submit" value="Login">
        </form>
        '''