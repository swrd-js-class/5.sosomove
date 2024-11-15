// import {
//   CollectionRequest,
//   CollectionEstCar,
//   CollectionEstHelper,
//   Collectionestimate,
//   CollectionEstConfirm,
// } from "/imports/api/collections";
// import "/lib/utils.js";

// if (!Meteor.users.find({ "profile.type": "관리자" }) === 0) {

//   Meteor.users.insert({
//     username: "admin",
//     password: "password",
//     profile: {
//       type: "관리자",
//       name: "관리자"
//     }
//   });
// }
//
  Meteor.users.insert({
    email_id: "admin",
    password: "password",
    profile: {
      type: "관리자",
      name: "관리자"
    }
  });
}

// if (Meteor.users.find({ "profile.type": "일반" }).count() === 0) {
//   //일반 유저 생성
//   Meteor.users.insert({
//     username: "user0",
//     password: "password",
//     profile: {
//       type: "일반", // 일반 / 용달사업자 / 헬퍼사업자 / 관리자
//       name: "김사용",
//       phone: "010-111-1111",
//       profile: {},
//     },
//   });
if (Meteor.users.find({ "profile.type": "일반" }).count() === 0) {
  //일반 유저 생성
  Meteor.users.insert({
    email_id: "user0@naver.com",
    password: "password",
    profile: {
      type: "일반", // 일반 / 용달사업자 / 헬퍼사업자 / 관리자
      name: "김사용",
      phone: "010-111-1111"
    },
  });

// }

// if (Meteor.users.find({ "profile.type": "용달" }).count() === 0) {
//   Meteor.users.insert({
//     username: "business0",
//     password: "password",
//     profile: {
//       type: "용달", // 일반 / 사업자 / 관리자
//       name: "김용달",
//       phone: "010-222-2222",
//       company: {
//         company_name: "배달해요",
//         company_phone: "010-333-3333",
//         ceo_name: "김대표",
//         address: "서울시 광진구 자양동1",
//         business_number: "0100-1101-20",
//         comfirm: "승인",
//       },
//     },
//   });
if (Meteor.users.find({ "profile.type": "용달" }).count() === 0) {
  Meteor.users.insert({
    email_id: "business0@naver.com",
    password: "password",
    profile: {
      type: "용달", // 일반 / 사업자 / 관리자
      name: "김용달",
      phone: "010-222-2222",
      company: {
        company_name: "배달해요",
        company_phone: "010-333-3333",
        ceo_name: "김대표",
        address: "서울시 광진구 자양동1",
        business_number: "0100-1101-20",
        comfirm: "승인",
      },
    },
  });

//   Meteor.users.insert({
//     username: "business1",
//     password: "password",
//     profile: {
//       type: "헬퍼", // 일반 / 사업자 / 관리자
//       name: "김헬퍼",
//       phone: "010-444-4444",
//       company: {
//         company_name: "도와줘요",
//         company_phone: "010-555-2555",
//         ceo_name: "김헬퍼",
//         address: "서울시 광진구 자양동2",
//         business_number: "0100-1101-30",
//         comfirm: "승인",
//       },
//     },
//   });
  Meteor.users.insert({
    email_id: "business1@naver.com",
    password: "password",
    profile: {
      type: "헬퍼", // 일반 / 사업자 / 관리자
      name: "김헬퍼",
      phone: "010-444-4444",
      company: {
        company_name: "도와줘요",
        company_phone: "010-555-2555",
        ceo_name: "김헬퍼",
        address: "서울시 광진구 자양동2",
        business_number: "0100-1101-30",
        comfirm: "승인",
      },
    },
  });

// }

// // //const { objectId } = require('mongodb');
// // //const id = new objectId();
// //const { objectId } = require('mongodb');
// //const id = new objectId();

// if (!CollectionRequest.findOne()) {
//   //const users = Meteor.account.find({ "profile.type": "일반" }).fetch();
//   const users = Meteor.users.find({ "profile.type": "일반" }).fetch();
//   const user = users.random();

//   CollectionRequest.insert({
//     createdAt: new Date(),
//     user_id: user._id,
//     user_name: user.name,
//     house_size: [10, 20, 30].random(), //집 평수
//     move_date: new Date(), //이사날짜
//     start_address: ["서울시", "대구시", "부산시"].random(), //출발지
//     arrive_address: ["서울시", "대구시", "부산시"].random(), //도착지
//     addworker: "Y",
//     confirmYN: "진행중",
//   });
// }
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

// if (!CollectionEstCar.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   CollectionEstCar.insert({
//     createdAt: new Date(),
//     request_id: requests.random()._id,
//     req_arr_time: "14", //도착요청시간
//     str_addr_elv: "Y",
//     arr_addr_elv: "N",
//     ladder_truck: {
//       start: "불필요",
//       arrive: "필요",
//     },
//     appliances: {
//       //가전
//       세탁기: "Y",
//       건조기: "Y",
//       냉장고: "Y",
//     },
//     funiture: {
//       침대메트리스: "Y",
//       침대프레임: "Y",
//       책상: "Y",
//       의자: "Y",
//     },
//     detail: "",
//     picthure: [],
//   });
// }

// if (!CollectionEstHelper.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   CollectionEstHelper.insert({
//     createdAt: new Date(),
//     request_id: requests.random()._id,
//     request_time_area: "오전", //요청시간대
//     h_type: "짐싸기", //요청사항
//     h_req_arr_time: "10", //도착요청시간
//     s_house_size: "7", //출발집평수
//     a_house_size: "15", //도착집평수,
//     picture: "",
//   });
// }

// //용달/헬퍼사업자 견적서(사업자)
// if (!Collectionestimate.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   const request = requests.random();

//   const users = Meteor.users.find({ "profile.type": "용달" }).fetch();
//   const estCaruser = users.random();

//   Collectionestimate.insert({
//     request_id: request._id,
//     business_id: estCaruser._id,
//     business_name: estCaruser.profile.company.company_name,
//     business_contect: estCaruser.profile.phone,
//     arrival_time: "16",
//     details: "견적서1",
//     amount: "20000",
//   });
// }

// // if (!CollectionEstConfirm.findOne()) {
// //   const requests = CollectionRequest.find().fetch();
// //   const request = requests.random();

//   const estCars = CollectionEstCar.find({ request_id: request._id }).fetch();
//   const estCar = estCars.random();
//   const estHelpers = CollectionEstHelper.find({
//     request_id: request._id,
//   }).fetch();
//   const estHelper = estHelpers.random();
//   CollectionEstConfirm.insert({
//     //사용자가 한건을 확정 지음.
//     createdAt: new Date(),
//     user_id: request.user_id,
//     request_id: request._id,
//     estCar_id: estCar._id,
//     estHelper_id: estHelper._id,
//   });
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
