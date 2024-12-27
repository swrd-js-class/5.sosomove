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
export MONGO_URL=mongodb://admin:mStartup!24@localhost:27777/db5jo?authSource=admin
export AZURE_API_KEY="9Z38qzJ5LwWvnTGgDrl6uZFGkRm60uVz6KhcawHHK7enymVHkMF9JQQJ99ALACYeBjFXJ3w3AAABACOGrqQp"
export AZURE_API_URL="https://ai-sosogpt.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-08-01-preview"
export AZURE_CV_KEY="6w72WwdKKMxVEZTZxLVha640eG50A1mekHsnePNuyLcphmXkHX5eJQQJ99ALACYeBjFXJ3w3AAAFACOG4dQ8"
export AZURE_CV_URL="https://ai-sosocv.cognitiveservices.azure.com/vision/v3.2/analyze"

export ROOT_URL="https://db5jo.meteor.or.kr"
export PORT=5112

#meteor -p5025

METEOR_NODE_PATH=$(meteor node -e "console.log(process.execPath);" 2>&1)
pm2 start .meteor/build/bundle/main.js --name "db5jo" --interpreter "$METEOR_NODE_PATH"

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
