from wsgiref.simple_server import make_server
from tg import MinimalApplicationConfigurator
from controllers.root_controller import RootController
from beaker.middleware import SessionMiddleware
import json

# Configure a new minimal application with our root controller.
config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController(),
    'session.enabled': True,
    'session.data_serializer': 'json'
})

session_options = {
    'session.type': 'cookie',  
    'session.cookie_expires': True,
    'session.auto': True,
    'session.key': 'test_session_key', # generate actual keys
    'session.secret': 'test_secret_key',
    'session.validate_key': 'test_validate_key'
}
app = SessionMiddleware(config.make_wsgi_app(), session_options)

# Serve the newly configured web application.
print("Serving on port 8080...")
httpd = make_server('', 8080, app)
httpd.serve_forever()