//견적서확인 페이지
import React, { useEffect, useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link } from 'react-router-dom';
import MypageNavbar from "./MypageNavbar.jsx";
import "/lib/utils.js";

export default () => {


  let i = 1;

  //일단 사용자 하나 db에서 빼오기
  const [user, setUser] = useState('');
  const userId = Meteor.userId();

  //테스트용 유저 생성, 테스트 끝난 후 반드시 주석처리!!
  // if (!Meteor.userId()) {
  //   Meteor.call('loginAsTestUser', (error, result) => {
  //     setUser(result);
  //   })

  Meteor.call('userSearch', { param: userId }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    setUser(result);
  })

  //request테이블에서 견적서내용 리스트 뽑기
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    Meteor.call('requestListCall', { param: userId }, (err, result) => {
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
              {i++}
              {request.createdAt.toStringYMD()}
              {request.user_name}
              {request.move_date.toStringYMD()}
              {request.start_address}
              {request.arrive_address}
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