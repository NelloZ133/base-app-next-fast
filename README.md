# lot_quality_check

- Edit .env file in backend/.env
	- PG_USER: username of the master postgresql database
	- PG_PASS: password of the master postgresql database
	- PG_SERVER: hostname or ipaddress of the master postgresql database
	- PG_PORT: port number of the postgresql database
	- PG_DB: a name of database
	- EMAIL_HOST: url of smtp server
	- EMAIL_PORT: a port to connect to smtp server
	- EMAIL_USERNAME: usernam to authenticate with smtp server
	- EMAIL_PASSWORD: password to authenticate with smtp server
	- API_KEY: an api key
- Edit environment value in backend/runcron.sh. There are variables about email and api key. Please use the similar values as in .env file

- Edit .env file in frontend/.env
	- NEXT_PUBLIC_API_URL: url to the API , it should be `http://{hostname or ip}/api`
		- Note, we have self-sign certificate. So if you need to run frontend with `https`, please set api url with `https` too. 
		- If hostname has not been registered with DNS, please use ip of the server which user need to connect to.
	- NEXT_PUBLIC_API_KEY: an api key

- Build and run
	- `docker-compose build`
	- `docker-compose up -d`
	- `docker-compose logs -f --tail 500` to show logs
	