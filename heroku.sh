#!bin\bash

git commit -am "temp"
git push heroku master
heroku logs --tail
heroku config:set PROD_MONGODB=mongodb+srv://lps:lps2020$@cluster0-ssupn.mongodb.net/test?retryWrites=true&w=majority
heroku addons:create mongolab
heroku addons:create mongolab:shared-cluster-1
