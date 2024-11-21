import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";


// import {
//   CollectionRequest,
//   CollectionEstCar,
//   CollectionEstHelper,
//   Collectionestimate,
//   CollectionEstConfirm,
// } from "/imports/api/collections";





Meteor.startup(() => {

  //   //Meteor.users를 퍼블리시함
  //   Meteor.publish('users', function () {
  //     return Meteor.users.find();
  //   });

  //   Meteor.publish('users', function (skip, limit) {
  //     return Meteor.users.find({}, { skip, limit });
  //   });

  Meteor.publish('files', function () {
    return Files.find().cursor;
  });


  Meteor.methods({
    getFileLink(fileId) {
      const file = Files.findOne(fileId);
      if (file) {
        return file.link();
      }
      throw new Meteor.Error("파일을 찾을 수 없습니다.");
    }
  });

  // //관리자 생성
  // if (Meteor.users.find({ 'profile.type': "관리자" }).count() === 0) {
  //   Accounts.createUser({
  //     username: "admin",
  //     password: "1111",
  //     profile: {
  //       type: "관리자",
  //       name: "관리자",
  //       phone: "1",
  //       company: null,
  //     },
  //   });
  // }

  // //일반회원 생성
  // if (Meteor.users.find({ 'type': "일반" }).count() === 0) {
  //   for (let i = 1; i <= 10; i++) {
  //     Accounts.createUser({
  //       username: `user${i}`,
  //       password: "1111",
  //       profile: {
  //         type: "일반",
  //         name: "김사용",
  //         phone: "010-111-1111",
  //         company: null,
  //       }
  //     });
  //   }
  // }

  // //용달사업자 등록
  // if (Meteor.users.find({ 'type': "용달" }).count() === 0) {
  //   for (let i = 1; i <= 5; i++) {
  //     Accounts.createUser({
  //       username: `용달${i}`,
  //       password: "1111",
  //       profile: {
  //         type: "용달",
  //         name: "김용달",
  //         phone: "010-222-2222",
  //         company:
  //         {
  //           company_name: "배달해요",
  //           company_phone: "010-333-3333",
  //           ceo_name: "김대표",
  //           address: "서울시 광진구 자양동1",
  //           business_number: "0100-1101-20",
  //           business_certificate: null,
  //           call_number: null,
  //           confirm: false,
  //         },

  //       },
  //     });
  //   }
  // }

  // //헬퍼사업자 등록
  // if (Meteor.users.find({ 'profile.type': "헬퍼" }).count() === 0) {
  //   for (let i = 1; i <= 5; i++) {
  //     Accounts.createUser({
  //       username: `헬퍼${i}`,
  //       password: "1111",
  //       profile: {
  //         type: "헬퍼",
  //         name: "김헬퍼",
  //         phone: "010-333-3333",
  //         company: [
  //           {
  //             company_name: "도와줘요",
  //             company_phone: "010-555-2555",
  //             ceo_name: "김헬퍼",
  //             address: "서울시 광진구 자양동2",
  //             business_number: "0100-1101-30",
  //             business_certificate: null,
  //             call_number: null,
  //             confirm: false,
  //           }
  //         ],
  //       },
  //     });
  //   }
  // }
  // //헬퍼사업자 등록
  // if (Meteor.users.find({ 'type': "헬퍼" }).count() === 0) {
  //   for (let i = 1; i <= 5; i++) {
  //     Accounts.createUser({
  //       username: `헬퍼${i}`,
  //       password: "1111",
  //       profile: {
  //         type: "헬퍼",
  //         name: "김헬퍼",
  //         phone: "010-333-3333",
  //         company:
  //         {
  //           company_name: "도와줘요",
  //           company_phone: "010-555-2555",
  //           ceo_name: "김헬퍼",
  //           address: "서울시 광진구 자양동2",
  //           business_number: "0100-1101-30",
  //           business_certificate: null,
  //           call_number: null,
  //           confirm: false,
  //         },

  //       },
  //     });
  //   }
  // }

});

// Meteor.methods({
//   'users.update'(_id, confirm) {
//     Meteor.users.update(_id, {
//       $set: {
//         'profile.company.confirm': confirm,
//       },
//     });
//   }
// });


// if (CollectionRequest.find().count() === 0) {
//   const users = Meteor.users.find({ 'profile.type': '일반' }).fetch();
//   const user = users.random();

//   CollectionRequest.insert({
//     createdAt: new Date(),
//     user_id: user._id,
//     user_name: user.profile.name,
//     house_size: [10, 20, 30].random(), //집 평수
//     move_date: new Date(), //이사날짜
//     start_address: ["서울시", "대구시", "부산시"].random(), //출발지
//     arrive_address: ["서울시", "대구시", "부산시"].random(), //도착지
//     addworker: true,
//     addHelper: true,
//     confirmYN: "진행중",
//   });
// }

// if (!CollectionEstCar.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   CollectionEstCar.insert({
//     createdAt: new Date(),
//     request_id: requests.random()._id,
//     req_arr_time: "14", //도착요청시간
//     str_addr_elv: "Y",
//     arr_addr_elv: "N",
//     ladder_truck: {
//       start: "false",
//       arrive: "true",
//     },
//     appliances: [
//       //가전
//       "세탁기",
//       "건조기",
//       "냉장고",
//     ],
//     funiture: [
//       "침대메트리스",
//       "침대프레임",
//       "책상",
//       "의자",
//     ],
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

// if (!CollectionEstConfirm.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   const request = requests.random();

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
// }

// //ksh. 테스트용 코드입니다.
// Meteor.methods({
//   loginAsTestUser() {
//     if (!this.userId) {
//       const testUser = Meteor.users.findOne({ 'profile.type': '관리자' });

//       if (testUser) {
//         //this.setUserId(testUser._id);
//         //this.setUsername(testUser.username);
//         return testUser.profile.name;
//       }
//     }
//     return null;
//   },

//   //견적요청서 리스트 조회
//   requestListCall() {
//     const requestList = CollectionRequest.find({}, { sort: { createAt: -1 } }).fetch();

//     if (requestList) {
//       return requestList;
//     }

//     return null;
//   },

//   //견적요청서 상세내역 조회
//   requestDetailCall(id) {
//     check(id, string);

//     console.log("Main id : " + id);

//     const requestDetail = CollectionRequest.find({ _id: id }).fetch();

//     if (requestList) {
//       return requestDetail;
//     }

//     return null;
//   },

//   //견적요청서 조회-용달
//   requestEstCarCall() {
//     const requestEstCar = CollectionEstCar.find({ 'request_id': id }).fetch();

//     if (requestList) {
//       return requestEstCar;
//     }

//     return null;
//   },

//   //견적요청서 조회-헬퍼
//   requestHelperCall() {
//     const requestHelper = CollectionEstHelper.find({ 'request_id': id }).fetch();

//     if (requestList) {
//       return requestHelper;
//     }

//     return null;
//   },

//   //사업자 견적서 조회
//   estimateCall() {
//     const estimateList = Collectionestimate.find({ 'request_id': id }).fetch();

//     if (requestList) {
//       return estimateList;
//     }

//     return null;
//   }

// });

// // 퍼블리시
// Meteor.publish('CollectionEstCar', function () {
//   return CollectionEstCar.find();
// });

// Meteor.publish('CollectionEstHelper', function () {
//   return CollectionEstHelper.find();
// });

// Meteor.publish('CollectionRequest', function () {
//   return CollectionRequest.find();
// });
