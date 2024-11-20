import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";

// import {
//   CollectionRequest,
//   CollectionEstCar,
//   CollectionEstHelper,
//   Collectionestimate,
//   CollectionEstConfirm,
// } from "/imports/api/collections";

Meteor.publish('files', function () {
  if (this.userId) {
    // 파일 메타데이터에서 userId 필드를 찾아 퍼블리시
    return Files.find().cursor; // 로그인한 사용자 ID로 파일 필터링
  }
  return [];  // 로그인하지 않으면 빈 배열 반환
});

Meteor.startup(() => {

  //   //Meteor.users를 퍼블리시함
  //   Meteor.publish('users', function () {
  //     return Meteor.users.find();
  //   });

  //   Meteor.publish('users', function (skip, limit) {
  //     return Meteor.users.find({}, { skip, limit });
  //   });



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


