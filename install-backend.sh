# First do this
# Change DB name, username and password in .example.env

composer install &&
cp .env.example .env &&
php artisan key:generate &&
php artisan storage:link &&
php artisan migrate --seed &&
php artisan serve --port=8000