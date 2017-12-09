default: build

clean:

build: 
	docker build -t badchess/backend backend
	docker build -t badchess/backend frontend

run: 
	-pkill docker-compose
	docker-compose up

restart:
	docker-compose restart backend frontend

shell:
	docker-compose exec backend /app/src/manage.py shell_plus

test:
	docker-compose exec backend /app/src/manage.py test --no-input --parallel $(args)

clean_db:
	echo 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' | docker-compose exec db psql -U postgres

init_db: clean_db 
	cat ./backend/init_db.sql | docker-compose exec db psql -U postgres
	docker-compose exec backend /app/src/manage.py migrate

backup_db:
	docker-compose exec db pg_dumpall -c -U postgres > badchess_dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

install_package:
	docker-compose exec backend pip3 install $(pkg)
	docker-compose exec backend pip3 freeze | tail -n +2 > requirements.txt

