import { Meteor } from 'meteor/meteor';
import { Files } from "/imports/api/Files.js";
import {
  CollectionRequest,
  CollectionEstimate,
} from "/imports/api/collections";
import "/lib/utils.js";
import {
  CollectionRequest,
  CollectionEstimate,
} from "/imports/api/collections";
import "/lib/utils.js";

//user - 관리자
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
//file-link처리
Meteor.methods({
  getFileLink(fileId) {
    const file = Files.findOne(fileId);
    if (file) {
      return file.link();
    }
    throw new Meteor.Error("파일을 찾을 수 없습니다.");
  }
});
//요청서 확인
Meteor.publish('CollectionRequest', function () {
  return CollectionRequest.find();
});
//견적서 확인
Meteor.publish('CollectionEstimate', function () {
  return CollectionEstimate.find();
});

//가입승인
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
  if (Meteor.users.find({ 'profile.type': "일반" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
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

  //용달사업자 생성
  if (Meteor.users.find({ 'profile.type': "용달" }).count() === 0) {
    for (let i = 1; i <= 5; i++) {
      Accounts.createUser({
        username: `용달${i}`,
        password: "1111",
        profile: {
          type: "용달",
          name: "김용달",
          phone: "010-222-2222",
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
          name: "김헬퍼",
          phone: "010-333-3333",
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
});//더미데이터 끝

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

  //견적요청서 리스트 조회
  requestListCall() {
    const requestList = CollectionRequest.find({}, { sort: { createAt: -1 } }).fetch();

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
  }
});