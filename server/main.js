import { Meteor } from 'meteor/meteor';

import {
  CollectionRequest,
  CollectionEstCar,
  CollectionEstHelper,
  Collectionestimate,
  CollectionEstConfirm,
} from "/imports/api/collections";
//import "/lib/utils.js";

Meteor.startup(() => {

  //Meteor.users를 퍼블리시함
  Meteor.publish('users', function () {
    return Meteor.users.find();
  });

  //관리자 생성
  if (Meteor.users.find({ 'profile.type': "관리자" }).count() === 0) {
    Accounts.createUser({
      username: "admin",
      password: "1111",
      profile: {
        type: "관리자",
        name: "관리자",
        phone: "1",
        company: null,
      },
    });
  }

  //일반회원 생성
  if (Meteor.users.find({ 'type': "일반" }).count() === 0) {
    for (let i = 1; i <= 10; i++) {
      Accounts.createUser({
        username: `user${i}`,
        password: "1111",
        profile: {
          type: "일반",
          name: "김사용",
          phone: "010-111-1111",
          company: null,
        }
      });
    }
  }



  //용달사업자 등록
  if (Meteor.users.find({ 'type': "용달" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `용달${i}`,
        password: "1111",
        profile: {
          type: "용달",
          name: "김용달",
          phone: "010-222-2222",
          company: [
            {
              company_name: "배달해요",
              company_phone: "010-333-3333",
              ceo_name: "김대표",
              address: "서울시 광진구 자양동1",
              business_number: "0100-1101-20",
              business_certificate: null,
              call_number: null,
              confirm: false,
            }
          ],
        },
      });
    }
  }

  //헬퍼사업자 등록
  if (Meteor.users.find({ 'type': "헬퍼" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `헬퍼${i}`,
        password: "1111",
        profile: {
          type: "헬퍼",
          name: "김헬퍼",
          phone: "010-333-3333",
          company: [
            {
              company_name: "도와줘요",
              company_phone: "010-555-2555",
              ceo_name: "김헬퍼",
              address: "서울시 광진구 자양동2",
              business_number: "0100-1101-30",
              business_certificate: null,
              call_number: null,
              confirm: false,
            }
          ],
        },
      });
    }
  }

});


if (!CollectionRequest.findOne()) {
  //const users = Meteor.account.find({ "profile.type": "일반" }).fetch();
  const users = Meteor.users.find({ "profile.type": "일반" }).fetch();
  const user = users.random();

  CollectionRequest.insert({
    createdAt: new Date(),
    user_id: user._id,
    user_name: user.profile.name,
    house_size: [10, 20, 30].ranomd(), //집 평수
    move_date: new Date(), //이사날짜
    start_address: ["서울시", "대구시", "부산시"].random(), //출발지
    arrive_address: ["서울시", "대구시", "부산시"].random(), //도착지
    addworker: "Y",
    confirmYN: "진행중",
  });
}

if (!CollectionEstCar.findOne()) {
  const requests = CollectionRequest.find().fetch();
  CollectionEstCar.insert({
    createdAt: new Date(),
    request_id: requests.random()._id,
    req_arr_time: "14", //도착요청시간
    str_addr_elv: "Y",
    arr_addr_elv: "N",
    ladder_truck: {
      start: "불필요",
      arrive: "필요",
    },
    appliances: {
      //가전
      세탁기: "Y",
      건조기: "Y",
      냉장고: "Y",
    },
    funiture: {
      침대메트리스: "Y",
      침대프레임: "Y",
      책상: "Y",
      의자: "Y",
    },
    detail: "",
    picthure: [],
  });
}

if (!CollectionEstHelper.findOne()) {
  const requests = CollectionRequest.find().fetch();
  CollectionEstHelper.insert({
    createdAt: new Date(),
    request_id: requests.random()._id,
    request_time_area: "오전", //요청시간대
    h_type: "짐싸기", //요청사항
    h_req_arr_time: "10", //도착요청시간
    s_house_size: "7", //출발집평수
    a_house_size: "15", //도착집평수,
    picture: "",
  });
}

//용달/헬퍼사업자 견적서(사업자)
if (!Collectionestimate.findOne()) {
  const requests = CollectionRequest.find().fetch();
  const request = requests.random();

  const users = Meteor.users.find({ "profile.type": "용달" }).fetch();
  const estCaruser = users.random();

  Collectionestimate.insert({
    request_id: request._id,
    business_id: estCaruser._id,
    business_name: estCaruser.profile.company.company_name,
    business_contect: estCaruser.profile.phone,
    arrival_time: "16",
    details: "견적서1",
    amount: "20000",
  });
}

if (!CollectionEstConfirm.findOne()) {
  const requests = CollectionRequest.find().fetch();
  const request = requests.random();

  const estCars = CollectionEstCar.find({ request_id: request._id }).fetch();
  const estCar = estCars.random();
  const estHelpers = CollectionEstHelper.find({
    request_id: request._id,
  }).fetch();
  const estHelper = estHelpers.random();
  CollectionEstConfirm.insert({
    //사용자가 한건을 확정 지음.
    createdAt: new Date(),
    user_id: request.user_id,
    request_id: request._id,
    estCar_id: estCar._id,
    estHelper_id: estHelper._id,
  });
}

// 퍼블리시
Meteor.publish('CollectionEstCar', function () {
  return CollectionEstCar.find();
});

Meteor.publish('CollectionEstHelper', function () {
  return CollectionEstHelper.find();
});
