from wsgiref.simple_server import make_server
from tg import MinimalApplicationConfigurator
from controllers.root_controller import RootController
import json

# Configure a new minimal application with our root controller.
config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController()
})

# Serve the newly configured web application.
print("Serving on port 8080...")
httpd = make_server('', 8080, config.make_wsgi_app())
httpd.serve_forever()