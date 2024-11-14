import { Accounts } from 'meteor/accounts-base';


// import { Chats, Users, Files } from "/imports/api/collections";
// import "/lib/utils.js";

// if (!Meteor.users.find({ type: "관리자" }) === 0) {
//   Accounts.createUser({
//     username: "admin",
//     password: "password",
//     profile: {
//       type: "관리자",
//       name: "관리자",
//     },
//   });
// }

// if (Meteor.users.find({ type: "일반" }).count() === 0) {
//   Accounts.createUser({
//     username: "user0",
//     password: "password",
//     profile: {
//       type: "일반",
//       name: "",
//       phone: "",
//       company: {},
//     },
//   });
// }

// if (Meteor.users.find({ type: "용달사업자" }).count() === 0) {
//   Accounts.createUser({
//     username: "business0",
//     password: "password",
//     profile: {
//       type: "용달사업자",
//       name: "",
//       phone: "",
//       company: {},
//     },
//   });
//   Accounts.createUser({
//     username: "business1",
//     password: "password",
//     profile: {
//       type: "헬퍼사업자",
//       name: "",
//       phone: "",
//       company: {},
//     },
//   });
// }

// if (!CollectionRequest.findOne()) {
//   const users = Meteor.users.find({ "profile.type": "일반" }).fetch();

//   CollectionRequest.insert({
//     createdAt: new Date(),
//     user_id: users.random()._id,
//     집평수: [10, 20, 30].ranomd(),
//     날짜: new Date(),
//     주소: ["서울시", "대구시", "부산시"].random(),
//     가구: {
//       tv: [1, 2, 3].random(),
//       장롱: [1, 2].random(),
//       침대: 0,
//     },
//     사진: [],
//   });
// }

// if (!CollectionEstCar.findOne()) {
//   const users = Meteor.users.find({ "profile.type": "용달사업자" }).fetch();
//   const requests = CollectionRequest.find().fetch();
//   CollectionEstCar.insert({
//     createdAt: new Date(),
//     user_id: users.random(),
//     request_id: requests.random(),
//     price: [100000, 200000, 300000].random(),
//   });
// }

// if (!CollectionEstHelper.findOne()) {
//   const users = Meteor.users.find({ "profile.type": "헬퍼사업자" }).fetch();
//   CollectionEstHelper.insert({
//     createdAt: new Date(),
//     user_id: users.random(),
//     request_id: requests.random(),
//     price: [100000, 200000, 300000].random(),
//   });
// }

// if (!CollectionEstConfirm.findOne()) {
//   const requests = CollectionRequest.find().fetch();
//   const request = requests.random();

//   const estCars = CollectionEstCar.find({ request_id: request._id }).fetch();
//   const estCar = estCars.random();
//   const estHelpers = CollectionEstHelpers.find({
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