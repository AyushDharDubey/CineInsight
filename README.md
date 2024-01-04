# The project can be experienced on https://ayushdhardubey.github.io/frontend

# OR

# You may setup the project on your local machine as follows
First install all the dependencies with:

In backend folder:
```
pip install -r requirements.txt
```
In frontend folder:
```
npm i
```

then in backend folder create a file named ".env" having following structure:
```
SECRET_KEY = <secret_key>
BACKEND_BASE_HOST = "localhost:8000"
BACKEND_BASE_URL = "http://localhost:8000"
FRONTEND_BASE_URL = "http://localhost:3000"


GOOGLE_OAUTH2_CLIENT_ID = <client_id>
GOOGLE_OAUTH2_CLIENT_SECRET = <client_secret>
CHANNELI_OAUTH_CLIENT_ID = <client_id_obtained_from_channeli.in/developers>
CHANNELI_OAUTH_CLIENT_SECRET = <client_secret_key_obtained_from_channeli.in/developers>

EMAIL_HOST = <email_host>
EMAIL_PORT = <email_port>
EMAIL_FROM = <developer's_email>
EMAIL_HOST_USER = <if_required_by_host>
EMAIL_HOST_PASSWORD = <password>
```

and in frontend folder there should be a .env file having
```
REACT_APP_BASE_BACKEND = "http://localhost:8000"
REACT_APP_BASE_FRONTEND = "http://localhost:3000"
REACT_APP_CHANNELI_OAUTH_CLIENT_ID = <client_id_obtained_from_channeli.in/developers>
REACT_APP_GOOGLE_OAUTH2_CLIENT_ID = <client_id>