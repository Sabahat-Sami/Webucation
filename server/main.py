from tg import expose, TGController, AppConfig
from wsgiref.simple_server import make_server

class MyController(TGController):
    @expose
    def index(self):
        return 'Hello, TurboGears'

config = AppConfig(minimal=True, root_controller=MyController())

app = config.make_wsgi_app()

server = make_server('', 8080, app)
server.serve_forever()