//견적서확인 페이지
import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

export default () => {
// const user = useTracker(() => Meteor.user());
// const isLoading = useTracker(() => !Meteor.loggingIn() && !user);

// //로딩 중일때 로딩메세지 표시
// if (isLoading) return <p>Loding....</p>

// if (!user) return <p>No user logged in</p>

//일단 사용자 하나 db에서 빼오기
//   const user = useTracker(() => {
//     const handle = Meteor.subscribe('userData');
//     return Meteor.users.findOne({ "profile.type": "일반" })
//   });
//   console.log('******************' + user);

//   return (
//     <div>
//       <img src="/user_img.jpg" alt="user image" class="user_img" />
//       <h4>{user.profile.username}님</h4>
//     </div>
//   );
 };