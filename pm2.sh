#!/bin/sh
#export CLIENT_NAME=admin    # 화면 버전 이름
#export IS_TEST_MODE=true    # 실행 모드 or 테스트 모드
#ln -sfn ../tests/clients/$CLIENT_NAME ./client/targetClient
#export DDP_DEFAULT_CONNECTION_URL=http://localhost:3030
#export NODE_OPTIONS=--debug=5858
# export DISABLE_WEBSOCKETS=true   #remove to prevent some devices can't login

#export NODE_OPTIONS="--max-old-space-size=3072" #3G 기준

#export MONGO_OPLOG_URL=mongodb://oplogger:mStartup!24@211.249.61.156:27777/local?authSource=admin
#export MONGO_URL=mongodb://yegam:mStartup!24@211.249.61.156:27777/soongrye
export MONGO_OPLOG_URL=mongodb://admin:mStartup!24@localhost:27777/local?authSource=admin
export MONGO_URL=mongodb://admin:mStartup!24@localhost:27777/artwith?authSource=admin

#export MONGO_OPLOG_URL=mongodb://oplogger:Thflskf0@54.65.142.59:27777/local?authSource=admin
#export MONGO_URL=mongodb://vansports:Thflskf0@54.65.142.59:27777/vansports
export HTTP_FORWARDED_COUNT=1
#export MAIL_URL=smtp://postmaster@sv-1234.com:ada8ff07daa9c7c71d47776ba70614e5@smtp.mailgun.org:587
#export MAIL_URL=smtp://postmaster@artwith.kr:51199e2e23de44c287c6ca59b4fd5491@smtp.mailgun.org:587
# export MAIL_URL=smtps://help.shdang:waehok2526@smtp.gmail.com:465
export MAIL_URL=smtps://meteorstartup:kwlgevradebyrszc@smtp.gmail.com:465
#export MAIL_URL=smtps://meteorstartup:mStartup!!24@smtp.gmail.com:465
# export NODE_TLS_REJECT_UNAUTHORIZED=0
#export NODE_TLS_REJECT_UNAUTHORIZED=0
export ROOT_URL=https://artwith.kr
export PORT=5025

#meteor -p5025

METEOR_NODE_PATH=$(meteor node -e "console.log(process.execPath);" 2>&1)
pm2 start .meteor/build/bundle/main.js --name "artwith.kr" --interpreter "$METEOR_NODE_PATH"

#kill -9 |  ps ax | grep soongrye | awk '{print $1}'
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# nvm install 8.15.1
# node --version
#nohup meteor node .meteor/build/bundle/main.js --codeasy=soongrye &
# nohup node .meteor/build/bundle/main.js --codeasy=soongrye &
#meteor -p5020
#meteor --settings settings.json -p4000
		#meteor run android-device
		#meteor run ios-device

#    "dbUrlForGameInfo": "mongodb://vansports:Thflskf0@54.65.142.59:27777/vansports"
