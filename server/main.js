import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";
import { CollectionRequest, CollectionEstimate } from "/imports/api/collections";
import "/lib/utils.js";
import { Accounts } from "meteor/accounts-base";
import fetch from 'node-fetch';
import { WebApp } from 'meteor/webapp';
import multer from 'multer';


//이미지분석 객체 탐지 테스트용
const subscriptionKey = '3bCGjL1DVZWqmm28yT2y3aHTPNYkleql49sRVFF5TIKsfkiBpT1KJQQJ99ALACYeBjFXJ3w3AAAFACOGUhdT';
const endpoint = 'https://shj-cv.cognitiveservices.azure.com/vision/v3.2/analyze';

const upload = multer();

WebApp.connectHandlers.use('/ttt', (req, res, next) => {
  if (req.method === 'POST') {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        res.writeHead(500);
        res.end('File upload failed');
        return;
      }
      console.log('Received file:', req.file);
      try {
        // Azure API 호출
        const azureRes = await fetch(endpoint + '?visualFeatures=Objects', {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Type': 'application/octet-stream',
          },
          body: req.file.buffer,
        });
        const data = await azureRes.json();
        // console.log(data);

        //응답 받은 데이터 파싱
        const objects = data.objects;
        const objectsDetails = objects.map(object => ({
          객체: object.object,
          좌표: object.rectangle
        }));
        // console.log(objectsDetails);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(objectsDetails));  // Azure API 결과 반환

      } catch (err) {
        res.writeHead(500);
        res.end('Error: ' + err.message);
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});






//애저 오픈 AI GPT호출
Meteor.startup(() => {
  const fetchGPTResponse = async (prompt) => {
    const apiKey = '8FJ4HK4kROZM2zu1yhxQe3C5sOBMZZHCFjRT8jRTvxTy5L4g4uqgJQQJ99AKACYeBjFXJ3w3AAABACOGBbVs';
    const response = await fetch(`https://shj-pk.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${apiKey}`,
      },
      body: JSON.stringify({
        "messages": [
          {
            "role": "user",
            "content": prompt,
          }
        ],
        'max_tokens': 800,
      }),
    });

    const data = await response.json();
    //안되면 출력해보자!!!
    // console.log(data);  
    const rawText = data.choices[0].message.content;
    return rawText;
  };

  Meteor.methods({
    'openAI.query': async (prompt) => {
      return fetchGPTResponse(prompt);
    }
  });
});

//user - 관리자
Meteor.publish('users', function () {
  return Meteor.users.find();
});
//페이징처리
Meteor.publish('users', function (skip, limit) {
  return Meteor.users.find({}, { skip, limit });
});
//file처리
Meteor.publish('files', function () {
  return Files.find().cursor;
});

Meteor.methods({
  //file-link처리
  getFileLink(fileId) {
    const file = Files.findOne(fileId);
    if (file) {
      return file.link();
    }
    throw new Meteor.Error("파일을 찾을 수 없습니다.");
  },
  //전체회원 검색
  'users.list'() {
    return Meteor.users.find().fetch();
  },
  //전체회원 중 서치하고 싶은 회원 검색
  'users.search'(query) {
    return Meteor.users.find({ 'profile.name': { $regex: query, $options: 'i' } }).fetch();
  },
  //관리자-회원 삭제
  'userdelete'(userId) {
    const targetUser = Meteor.users.findOne(userId);
    return Meteor.users.remove(targetUser._id);
  },
  //가입승인
  'users.update'(_id, confirm) {
    Meteor.users.update(_id, {
      $set: {
        'profile.company.confirm': confirm,
      },
    });
  },
  //일반회원+관리자 정보수정(이름, 핸드폰번호)
  'useredit'({ name, phone }) {
    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': name,
        'profile.phone': phone,
      }
    })
  },
  //사업자회원 정보수정(사업장명, 대표번호, 대표자명, 사업장주소 )
  'businessedit'({ name, phone, ceo_name, address }) {
    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': name,
        'profile.phone': phone,
        'profile.company.ceo_name': ceo_name,
        'profile.company.address': address,
      }
    })
  },
  //모든 회원 정보수정(비밀번호)
  'userchangepw'(newPassword) {
    Accounts.setPassword(this.userId, newPassword, { logout: false });
  },
  //회원탈퇴
  'users.removeAccount'() {
    const userId = this.userId;
    Meteor.users.remove(userId);
    return '회원탈퇴 성공';
  }
});

///////////////////////////////////////여기까지 효정

//요청서 확인
Meteor.publish('CollectionRequest', function () {
  return CollectionRequest.find();
});

//견적서 확인
Meteor.publish('CollectionEstimate', function () {
  return CollectionEstimate.find();
});

//견적서 입력 및 삭제
Meteor.methods({
  'estimate.insert'(estimateData) {
    if (!this.userId) {
      throw new Meteor.Error('내용이 없습니다');
    }

    CollectionEstimate.insert({
      ...estimateData,
      createdAt: new Date(),
    });
  },

  'estimate.delete'(estimateId) {
    if (!this.userId) {
      throw new Meteor.Error('삭제가 불가합니다');
    }

    CollectionEstimate.remove({ _id: estimateId })
  }
});

///////////////////////더미데이터////////////////////////
Meteor.startup(() => {
  //관리자 생성
  if (Meteor.users.find({ 'profile.type': "관리자" }).count() === 0) {
    Accounts.createUser({
      username: "admin",
      password: "1111",
      profile: {
        type: "관리자",
        name: "관리자",
        phone: "010-0000-0000",
        company: null,
      },
    });
  }
  //일반회원 생성
  if (Meteor.users.find({ 'profile.type': "일반" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `user${i}`,
        password: "1111",
        profile: {
          type: "일반",
          name: `김철수${i}`,
          phone: "010-1111-1111",
          company: null,
        }
      });
    }
  }
  //용달사업자 생성
  if (Meteor.users.find({ 'profile.type': "용달" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `용달${i}`,
        password: "1111",
        profile: {
          type: "용달",
          name: `김용달${i}`,
          phone: "010-2222-2222",
          company:
          {
            ceo_name: "김대표",
            address: "서울시 광진구 자양동1",
            business_number: "0100-1101-20",
            confirm: false,
          },
        },
      });
    }
  }
  //헬퍼사업자 생성
  if (Meteor.users.find({ 'profile.type': "헬퍼" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `헬퍼${i}`,
        password: "1111",
        profile: {
          type: "헬퍼",
          name: `김헬퍼${i}`,
          phone: "010-3333-3333",
          company:
          {
            ceo_name: "김헬퍼",
            address: "서울시 광진구 자양동2",
            business_number: "0100-1101-30",
            confirm: false,
          },

        },
      });
    }
  }
  //Request Collection 생성
  if (CollectionRequest.find().count() === 0) {
    const users = Meteor.users.find({ 'profile.type': '일반' }).fetch();
    users.forEach(function (user) {
      CollectionRequest.insert({
        user_id: user._id,
        user_name: user.profile.name,
        move_date: [new Date('2025-10-01'), new Date('2024-12-31'), new Date('2025-02-15')].random(), //이사날짜
        start_address: ["서울시", "대구시", "부산시"].random(), //출발지
        arrive_address: ["서울시", "대구시", "부산시"].random(), //도착지
        house_size: [10, 20, 30].random(), //집 평수
        addworker: true,
        reqCar: {
          req_arr_time: "14", //도착요청시간
          str_addr_elv: true,
          arr_addr_elv: false,
          ladder_truck: {
            start: false,
            arrive: true,
          },
          appliances: [
            //가전
            "세탁기",
            "건조기",
            "냉장고",
          ],
          furniture: [
            "침대메트리스",
            "침대프레임",
            "책상",
            "의자",
          ],
          detail: "",
          car_confirm_id: null,
        },
        reqHelper: {
          request_time_area: "오전", //요청시간대
          h_type: "짐싸기", //요청사항
          h_req_arr_time: "10", //도착요청시간
          s_house_size: "7", //출발집평수
          a_house_size: "15", //도착집평수,
          hel_confirm_id: null,
        },
        createdAt: new Date(),
      });
    })
  }
  //견적서(용달 사업자 용)
  if (CollectionEstimate.find({ 'business_type': '용달' }).count() === 0) {
    const requests = CollectionRequest.find().fetch();
    const users = Meteor.users.find({ 'profile.type': '용달' }).fetch();
    users.forEach(function (estCaruser) {
      for (let i = 0; i < 5; i++) {
        const request = requests.random();
        CollectionEstimate.insert({
          request_id: request._id,
          business_id: estCaruser._id,
          business_name: estCaruser.profile.company.company_name,
          business_contact: estCaruser.profile.phone,
          details: "견적서1-용달",
          amount: "20000",
          business_type: "용달",
          crateAt: new Date()
        });
      }
    })
  }
  //견적서(헬퍼 사업자 용)
  if (CollectionEstimate.find({ 'business_type': "헬퍼" }).count() === 0) {
    const requests = CollectionRequest.find().fetch();
    const users = Meteor.users.find({ "profile.type": "헬퍼" }).fetch();
    requests.forEach(function (request) {
      users.forEach(function (estCaruser) {
        //for (let i = 0; i < 5; i++) {
        CollectionEstimate.insert({
          request_id: request._id,
          business_id: estCaruser._id,
          business_name: estCaruser.profile.company.company_name,
          business_contact: estCaruser.profile.phone,
          details: "견적서-헬퍼",
          amount: "20000",
          business_type: "헬퍼",
          crateAt: new Date()
        });
        //}
      })
    })
  }
});
/////////////////더미데이터 끝///////////////////////

//ksh. 
Meteor.methods({

  //테스트용 코드입니다.
  loginAsTestUser() {
    if (!this.userId) {
      const testUser = Meteor.users.findOne({ 'profile.type': '관리자' });

      if (testUser) {
        return testUser.profile.name;
      }
    }
    return null;
  },

  //사용자 조회
  userSearch({ param }) {

    const user = Meteor.users.findOne({ '_id': param });

    if (user) {
      return user.profile.name;
    }
  },

  //견적요청서 리스트 조회
  requestListCall({ param }) {
    const requestList = CollectionRequest.find({ 'user_id': param }, { sort: { createdAt: -1 } }).fetch();

    if (requestList) {
      return requestList;
    }

    return null;
  },

  //매칭내역 조회
  requestMatchingListCall({ param }) {
    const requestList = CollectionRequest.find(
      {
        'user_id': param,
        $or: [
          { 'reqCar.car_confirm_id': { $ne: null } },
          { 'reqHelper.hel_confirm_id': { $ne: null } }
        ]
      },
      { sort: { createdAt: -1 } }).fetch();

    if (requestList) {
      return requestList;
    }

    return null;
  },

  //견적요청서 상세내역 조회
  requestDetailCall({ param }) {

    const requestDetail = CollectionRequest.find({ _id: param }).fetch();

    if (requestDetail) {
      return requestDetail;
    }

    return null;
  },

  //사업자 견적서 조회
  estimateCall({ param, business_type }) {
    const estimateList = CollectionEstimate.find({ 'request_id': param, 'business_type': business_type }).fetch();

    if (estimateList) {
      return estimateList;
    }

    return null;
  },

  updateRequestConfirmBusiId({ requestId, car_businessId, hel_businessId }) {
    const query = {
      '_id': requestId
    }

    const update = {
      $set: {
        'reqCar.car_confirm_id': car_businessId,
        'reqHelper.hel_confirm_id': hel_businessId
      }
    }

    CollectionRequest.update(query, update);
  },

  //개인-신규 견적요청서 저장
  insertRequest(insertData) {
    CollectionRequest.insert(insertData);
  },

  //개인-견적요청서 수정
  updateRequest(requestId, updateData) {
    const query = {
      '_id': requestId
    }

    const {
      user_name,
      move_date,
      start_address,
      arrive_address,
      house_size,
      addworker,
      reqCar,
      reqHelper,
      createdAt
    } = updateData

    const update = {
      $set: {
        user_name,
        move_date,
        start_address,
        arrive_address,
        house_size,
        addworker,
        reqCar,
        reqHelper,
        createdAt
      }
    }

    CollectionRequest.update(query, update);
  },

  removeRequest({ param }) {
    try {
      const estremoveresult = CollectionEstimate.remove({ 'request_id': param });

      if (estremoveresult === 0) {
        throw new Error("CollectionEstimate 삭제 실패");
      }

      const reqremoveresult = CollectionRequest.remove({ '_id': param });

      if (reqremoveresult === 0) {
        throw new Error("CollectionRequest 삭제 실패");
      }

      console.log("두 컬렉션 삭제 성공");
    } catch (error) {
      console.error("컬렉션 삭제 중 오류 발생 : ", error);
      throw new Meteor.Error('delete-failed', error.message);
    }
  },

  //사업자정보 조회
  bizInfoSearch({ userId }) {
    const userInfo = Meteor.users.findOne({ '_id': userId });

    if (userInfo) {
      return userInfo;
    }
  },

  //매칭-해제
  updateRequestConfirmBizId({ requestId, type }) {
    const query = {
      '_id': requestId
    }

    const update = {};

    if (type === '용달') {
      update.$set = { 'reqCar.car_confirm_id': null };
    } else if (type === '헬퍼') {
      update.$set = { 'reqHelper.hel_confirm_id': null };
    }

    CollectionRequest.update(query, update);
  }
});