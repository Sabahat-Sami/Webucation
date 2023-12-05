import subprocess
import psycopg2
from psycopg2 import sql
from pathlib import Path
from config import DATABASE_PASSWORD

def create_database_if_not_exists(db_params):
    # Check if the database already exists
    conn_params = db_params.copy()
    conn_params['dbname'] = 'postgres'

    try:
        conn = psycopg2.connect(**conn_params)
        conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute('SELECT 1 FROM pg_database WHERE datname = %s', (db_params['dbname'],))
        exists = cursor.fetchone()
        if not exists:
            print('CREATE DATABASE {}'.format(db_params['dbname']))
            cursor.execute('CREATE DATABASE "{}"'.format(db_params['dbname']))
            conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_READ_COMMITTED)
    except Exception as e:
        print("Error creating DB: " + str(e))


def execute_sql_script(script_path, connection):
    with connection.cursor() as cursor:
        with open(script_path, 'r') as script_file:
            sql_script = script_file.read()
        cursor.execute(sql_script)

def encrypt_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf8')

if __name__ == "__main__":
    db_params = {
        'dbname': 'Webucation',
        'user': 'postgres',
        'password': f'{DATABASE_PASSWORD}',
        'host': 'localhost',
    }
    # dummy_profiles = [
    #     ('test@email.com', 'test@email.com', 'Test', 'User', '1234567890', 'I am a test user'),
    #     ('cc6923@nyu.edu', 'cc6923@nyu.edu', 'Calvin', 'Chu', '9876543210', 'CS @ NYU Tandon 2024'),
    #     ('tr2128@nyu.edu', 'tr2128@nyu.edu', 'Tanvi', 'Rahman', '5555555555', 'CS @ NYU Tandon 2024'),
    #     ('il2149@nyu.edu', 'il2149@nyu.edu', 'Ivan', 'Lin', '6666666666', 'CS @ NYU Tandon 2024'),
    #     ('ss14243@nyu.edu', 'ss14243@nyu.edu', 'Sabahat', 'Sami', '7777777777', 'CS @ NYU Tandon 2024')
    # ]

    try:
        create_database_if_not_exists(db_params)
        conn = psycopg2.connect(**db_params)

        sql_script_path = Path('./sql/schema.sql')
        execute_sql_script(sql_script_path, conn)

        # for profile in dummy_profiles:
        #     email, username, fname, lname, phone_number, about = profile
        #     password = encrypt_password("password")
        #     cur.execute(
        #         "INSERT INTO Profile (email, username, password, fname, lname, phone_number, about) "
        #         "VALUES (%s, %s, %s, %s, %s, %s, %s)",
        #         (email, username, password, fname, lname, phone_number, about)
        #     )

        sql_script_path = Path('./sql/dummy_data.sql')
        execute_sql_script(sql_script_path, conn)

        conn.commit()
        print("SQL script executed successfully.")
    except Exception as e:
        print(f"Error executing SQL script: {e}")
    finally:
        conn.close()

        