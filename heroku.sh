#!/bin/bash

git commit -am "custom commit"
git push heroku master
heroku logs --tail

heroku addons:create mongolab:sandbox
heroku config:get MONGODB_URI

