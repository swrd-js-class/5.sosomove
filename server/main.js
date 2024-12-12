import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";
import { CollectionRequest, CollectionEstimate, Notifications } from "/imports/api/collections";
import "/lib/utils.js";
import { Accounts } from "meteor/accounts-base";
import fetch from 'node-fetch';
import { WebApp } from 'meteor/webapp';
import multer from 'multer';
import fs from 'fs';
import path from 'path';



///////////////////희원
//요청서 확인
Meteor.publish('CollectionRequest', function () {
  return CollectionRequest.find();
});

//견적서 확인
Meteor.publish('CollectionEstimate', function () {
  return CollectionEstimate.find();
});

Meteor.publish("estimateStatus", function (businessId) {
  if (!this.userId) {
    return this.ready();
  }

  return CollectionEstimate.find(
    { business_id: businessId },
    { fields: { status: 1, updateAt: 1, request_id: 1 } });
});

Meteor.methods({
  'estimate.insert'(estimateData) {
    // 사용자 인증
    if (!this.userId) {
      throw new Meteor.Error('Not authorized', '로그인된 사용자만 견적을 작성할 수 있습니다.');
    }

    // 요청 ID가 존재하는지 확인
    const request = CollectionRequest.findOne({ _id: estimateData.request_id });
    if (!request) {
      throw new Meteor.Error('Request not found', '요청 정보를 찾을 수 없습니다.');
    }

    // 데이터 삽입
    const insertedId = CollectionEstimate.insert(estimateData);
    if (!insertedId) {
      throw new Meteor.Error('Insert failed', '견적 삽입에 실패했습니다.');
    }

    return '견적서가 성공적으로 입력되었습니다.';
  },

  'estimate.delete'(estimateId) {
    // 사용자 인증
    if (!this.userId) {
      throw new Meteor.Error('Not authorized', '삭제가 불가합니다');
    }

    // 데이터 삭제
    const result = CollectionEstimate.remove({ _id: estimateId });
    if (!result) {
      throw new Meteor.Error('Delete failed', '견적 삭제에 실패했습니다.');
    }

    return '견적서가 성공적으로 삭제되었습니다.';
  }
});

Meteor.publish('notifications', function (businessId) {
  if (!businessId) {
    throw new Meteor.Error('missing-business-id', '사업자 ID가 필요합니다.');
  }
  return Notifications.find({ businessId }, { sort: { createdAt: -1 } });
});

Meteor.methods({
  notifyStatusChange({ businessId, message }) {
    Notifications.insert({
      businessId,
      message,
      createdAt: new Date(),
    });
  },
});
///////////////////희원 끝

///////////////////////더미데이터 시작////////////////////////
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
          status: 1,
          request_del_flag: false,
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
          status: 1,
          request_del_flag: false,
          crateAt: new Date()
        });
        //}
      })
    })
  }
});
////////////////////////더미데이터 끝///////////////////////

///////////////////////효정
//azure-컴퓨터비전
const subscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_URL;
const upload = multer();
WebApp.connectHandlers.use('/ttt', (req, res, next) => {
  if (req.method === 'POST') {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        res.writeHead(500);
        res.end('File upload failed');
        return;
      }
      // console.log('Received file:', req.file);
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
        const meta = data.metadata;
        const objectsDetails =
          objects.map(object => ({
            사물: object.object,
            좌표: object.rectangle,
            사진크기: meta
          }));
        // console.log(objectsDetails);  //출력해보자!!!
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

//azure-GPT
Meteor.startup(() => {
  const fetchGPTResponse = async (prompt) => {
    const apiKey = process.env.AZURE_API_KEY;
    const url = process.env.AZURE_API_URL;
    const response = await fetch(url, {
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
        'max_tokens': 1000,
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

//user
Meteor.publish('users', function () {
  return Meteor.users.find();
});
//페이징
Meteor.publish('users', function (skip, limit) {
  return Meteor.users.find({}, { skip, limit });
});
//file
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
  //전체회원
  'users.list'() {
    return Meteor.users.find({}, { sort: { createdAt: -1 } }).fetch();
  },
  //회원 검색
  'users.search'(query) {
    return Meteor.users.find({ 'profile.name': { $regex: query, $options: 'i' } }).fetch();
  },
  //회원 삭제시 파일 데이터 같이 삭제
  deleteUserFiles(userId) {
    const userFiles = Files.find({ 'meta.userId': userId }).fetch();
    const deletedFiles = [];
    userFiles.forEach(file => {
      try {
        const filePath = path.join(__dirname, 'uploads', file.name);
        // 로컬 파일 삭제
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`로컬 파일 ${file.name} 삭제 완료`);
        }
        // 데이터베이스 파일 삭제
        Files.remove(file._id);
        deletedFiles.push(file);
      } catch (error) {
        console.error('파일 삭제 오류:', error);
      }
    });
    return deletedFiles;
  },
  //회원 삭제
  'userdelete'(userId) {
    const targetUser = Meteor.users.findOne(userId);
    return Meteor.users.remove(targetUser._id);
  },
  //가입승인
  'users.update'(_id) {
    Meteor.users.update(_id, {
      $set: {
        'profile.company.confirm': true,
      },
    });
  },
  //일반회원+관리자 정보수정
  'useredit'({ name, phone }) {
    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': name,
        'profile.phone': phone,
      }
    })
  },
  //사업자회원 정보수정
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
//////////////////효정 끝

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

  //개인-사업자 컨펌
  updateRequestConfirmBusiId({ requestId, car_businessId, hel_businessId }) {
    try {
      const query = {
        '_id': requestId
      }
      const update = {
        $set: {
          'reqCar.car_confirm_id': car_businessId,
          'reqHelper.hel_confirm_id': hel_businessId
        }
      }

      const requpdateresult = CollectionRequest.update(query, update);

      if (requpdateresult === 0) {
        throw new error("request 컬렉션 업데이트 중 오류 발생");
      }
    } catch (error) {
      console.error("컬렉션 update 중 오류 발생 : ", error);
      throw new Meteor.Error('update-failed', error.message);
    }
  },

  //개인-용달/헬퍼 견적서 컨펌 flag update
  updateEstMatchingFlag({ requestId, businessId, matchingFlag, car_businessId, hel_businessId }) {

    const query = {
      'request_id': requestId,
      'business_id': businessId
    };

    const update = {
      $set: {
        'status': matchingFlag
      }
    };

    // CollectionRequest.update(query, update);
    CollectionEstimate.update(query, update);

    // if (car_businessId) {
    //   CollectionEstimate.update(
    //     { business_id: car_businessId, request_id: requestId },
    //     { $set: { status: 2 } } // 2 - 매칭
    //   );
    // }

    // // hel_businessId가 존재하면 CollectionEstimate 상태 업데이트
    // if (hel_businessId) {
    //   CollectionEstimate.update(
    //     { business_id: hel_businessId, request_id: requestId },
    //     { $set: { status: 2 } } // 2 - 매칭
    //   );
    // }
    // CollectionEstimate.update(query, update);
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
      // createdAt
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
        // createdAt
      }
    }

    CollectionRequest.update(query, update);
  },

  //견적요청서 삭제
  removeRequest({ param }) {
    try {
      const query = {
        'request_id': param
      };

      const update = {
        $set: {
          'request_del_flag': true
        }
      }

      const estupdateresult = CollectionEstimate.update(query, update);

      if (estupdateresult.acknowledged === false) {
        throw new Error("CollectionEstimate update 실패");
      }

      const reqremoveresult = CollectionRequest.remove({ '_id': param });

      if (reqremoveresult.acknowledged === false) {
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
  updateRequestConfirmBizId({ requestId, type, bizId }) {
    try {
      const query = {
        '_id': requestId
      }

      const update = {};

      if (type === '용달') {
        update.$set = { 'reqCar.car_confirm_id': null };
      } else if (type === '헬퍼') {
        update.$set = { 'reqHelper.hel_confirm_id': null };
      }

      const updateresult = CollectionRequest.update(query, update);

      if (updateresult === 0) {
        throw new Error("request 컬렉션 업데이트 중 오류 발생");
      }

      const estquery = {
        'request_id': requestId,
        'business_id': bizId
      };

      const estupdate = {
        $set: {
          'status': 3
        }
      };

      const estupdateresult = CollectionEstimate.update(estquery, estupdate);

      //car, hel 매칭 취소 알림
      Notifications.insert({
        businessId: bizId,
        message: '견적 매칭이 취소되었습니다!',
        createdAt: new Date(),
      });

      if (estupdateresult === 0) {
        throw new Error("estimate 컬렉션 업데이트 중 오류 발생");
      }

    } catch (error) {
      console.error("컬렉션 update 중 오류 발생 : ", error);
      throw new Meteor.Error('update-failed', error.message);
    }

  }
});
