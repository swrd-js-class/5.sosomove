//견적서확인 페이지
import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Link } from 'react-router-dom';
import MypageNavbar from "./MypageNavbar.jsx";
import { CollectionRequest } from "/imports/api/collections";
import "/lib/utils.js";

export default () => {
  //const handleCar = Meteor.subscribe('CollectionEstCar');

  // const user = useTracker(() => Meteor.user());
  // const isLoading = useTracker(() => !Meteor.loggingIn() && !user);

  // //로딩 중일때 로딩메세지 표시
  // if (isLoading) return <p>Loding....</p>

  // if (!user) return <p>No user logged in</p>

  // if (Meteor.userId()) {
  //   setUser(useTracker(() =>
  //     Meteor.users.findOne({ "profile.type": "일반" })
  //   ));
  //   console.log('******************' + user);
  // }

  //일단 사용자 하나 db에서 빼오기
  const [user, setUser] = useState(null);
  const userId = Meteor.userId();

  //테스트용 유저 생성, 테스트 끝난 후 반드시 주석처리!!
  if (!Meteor.userId()) {
    Meteor.call('loginAsTestUser', (error, result) => {
      setUser(result);
    })
  };

  //request테이블에서 견적서내용 리스트 뽑기
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    Meteor.call('requestListCall', (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setRequestList(result);
    });
  }, []);


  return (
    <>
      <MypageNavbar />
      <div>
        <img src="/user_img.jpg" alt="user image" class="user_img" />
        <h4>{user}님</h4>
      </div>
      <div class="" >
        <h2>내 견적요청서</h2>
        <div>
          {requestList.map((request) => {
            return <div>
              {request.createdAt.toStringYMD()}
              {request.user_name}
              {request.move_date.toStringYMD()}
              {request.start_address}
              {request.arrive_address}
              {request.confirmYN}
              <Link to={`/requestdetail/${request._id}`}>
                <button>상세보기</button>
              </Link>
            </div>
          })}
        </div>
      </div>
      <div>
        <Link to={'/newRequest'} ><button>새 견적 요청</button></Link>
      </div>

    </>
  );
};