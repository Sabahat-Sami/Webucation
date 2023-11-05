from wsgiref.simple_server import make_server
from tg import MinimalApplicationConfigurator
from tg import expose, TGController
from connection import cursor
import json

# RootController of our web app, in charge of serving content for /
class RootController(TGController):
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

# Configure a new minimal application with our root controller.
config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController()
})

# Serve the newly configured web application.
print("Serving on port 8080...")
httpd = make_server('', 8080, config.make_wsgi_app())
httpd.serve_forever()