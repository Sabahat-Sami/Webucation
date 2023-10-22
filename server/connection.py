import psycopg2
from config import DATABASE_PASSWORD


try:
    conn = psycopg2.connect(dbname = 'Webucation', user='postgres', host='localhost', password=f'{DATABASE_PASSWORD}')
    cursor = conn.cursor()
    print("Connected!")
except (Exception, psycopg2.DatabaseError) as error:
    print("I am unable to connect to the database")
    print(error)
    cursor = None




