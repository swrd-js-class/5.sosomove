import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";



Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('users', function (skip, limit) {
  return Meteor.users.find({}, { skip, limit });
});

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

Meteor.methods({
  'users.update'(_id, confirm) {
    Meteor.users.update(_id, {
      $set: {
        'profile.company.confirm': confirm,
      },
    });
  }
});


Meteor.startup(() => {

  //관리자 생성
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
  // if (Meteor.users.find({ 'profile.type': "일반" }).count() === 0) {
  //   for (let i = 1; i <= 5; i++) {
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

  // //용달사업자 생성
  // if (Meteor.users.find({ 'profile.type': "용달" }).count() === 0) {
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

  // //헬퍼사업자 생성
  // if (Meteor.users.find({ 'profile.type': "헬퍼" }).count() === 0) {
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



