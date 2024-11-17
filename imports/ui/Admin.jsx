import React from "react";
import { useTracker } from 'meteor/react-meteor-data';

export default () => {

  const UsersList = useTracker(() => {
    Meteor.subscribe('users');
    return Meteor.users.find({}, { sort: { createdAt: -1 } }).fetch();
  });

  return (
    <div>
      <h1>사업자회원 승인여부 체크 목록</h1>
      <h1>회원 목록</h1>
      {UsersList.map((user) => (
        <div key={user._id}>
          <div>{user.username}/
            {user.profile.type}
          </div>
          {/* <article>
            <h2>
              <Link to={`/postDetail/${post._id}`}>{post.title}</Link>
            </h2>
            <p>{post.content.substring(0, 50)}...</p>
            <p>
              <time>{post.createdAt.toLocaleString()}</time>
            </p>
          </article> */}
        </div>
      ))}
    </div>
  );
};