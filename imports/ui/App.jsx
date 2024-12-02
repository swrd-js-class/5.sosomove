import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Gpt from "./Gpt.jsx";
import Signup from "./Signup.jsx";
import BusinessEst from "./BusinessEst.jsx";
import Admin from "./Admin.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import AdminBCheck from "./AdminBCheck.jsx";
import AdminBList from "./AdminBList.jsx";
import AdminEdit from "./AdminEdit.jsx";
import SignupDetail from "./SignupDetail.jsx";
import NotFound from "./NotFound.jsx";
import CheckRequest from "./CheckRequest.jsx";
import AllRequest from "./AllRequest.jsx";
import BusinessAllRequestDetails from "./BusinessAllRequestDetails.jsx";
import BusinessAllEstimate from "./BusinessAllEstimate.jsx";
import RequestDetail from "./RequestDetail.jsx";
import NewRequest from "./NewRequest.jsx";
import RequestUpdate from "./RequestUpdate.jsx";
import MatchingDetail from "./MatchingDetail.jsx";
import MypageNavbar from "./MypageNavbar.jsx";
import UserEdit from "./UserEdit.jsx";
import BusinessEdit from "./BusinessEdit.jsx";
import Layout from "./Layout.jsx";
import BusinessMypageNavbar from './BusinessMypageNavbar.jsx';
import Business from "./Business.jsx";
import Mypage from "./Mypage.jsx";
import AdminAllList from "./AdminAllList.jsx";

export const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/login" element={<Login />} />
          <Route path="/service" element={<Service />} />
          <Route path="/gpt" element={<Gpt />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signupdetail/:userType" element={<SignupDetail />} />
          <Route path="/adminnavbar" element={<AdminNavbar />} /> */
          <Route path="/businessNavbar" element={<BusinessMypageNavbar />} />
          <Route path="/MypageNavbar" element={<MypageNavbar />} />


          {/* 효정 */}
          <Route path="/admin" element={<Admin />}>
            <Route path="/admin/adminbcheck" element={<AdminBCheck />} />
            <Route path="/admin/adminblist" element={<AdminBList />} />
            <Route path="/admin/adminalllist" element={<AdminAllList />} />
            <Route path="/admin/adminedit" element={<AdminEdit />} />
          </Route>

          {/* 희원 */}
          <Route path="/business" element={<Business />}>
            <Route path="/business/allrequest" element={<AllRequest />} />
            <Route path="/business/businessAllEstimate" element={<BusinessAllEstimate />} />
            <Route path="/business/businessestimate/:id" element={<BusinessEst />} />
            <Route path="/business/request-details/:id" element={<BusinessAllRequestDetails />} />
            <Route path="/business/businessedit" element={<BusinessEdit />} />
          </Route>

          {/* 송희 */}
          <Route path="/mypage" element={<Mypage />}>
            <Route path="/mypage/newrequest" element={<NewRequest />} />
            <Route path="/mypage/requestdetail/:id" element={<RequestDetail />} />
            <Route path="/mypage/checkrequest" element={<CheckRequest />} />
            <Route path="/mypage/requestupdate/:id" element={<RequestUpdate />} />
            <Route path="/mypage/matchingdetail" element={<MatchingDetail />} />
            <Route path="/mypage/useredit" element={<UserEdit />} />
          </Route>


          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
};



