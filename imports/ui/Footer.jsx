import React from "react";

export default () => {

  return (
    <div className="flex items-end w-full h-1/10 bg-white">
      <footer className="w-full text-gray-700 bg-gray-100 body-font">
        <div className="container flex flex-col flex-wrap px-3 py-6 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap">
          <div className="flex-shrink-0 w-50 mx-auto text-center md:mx-0 md:text-left">
            <p className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start ">
              <b>소소이사(주)</b>
            </p>
            <div className="mt-4">
              <span className="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start">
                <a className="text-gray-500 cursor-pointer hover:text-gray-700">
                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a className="ml-3 text-gray-500 cursor-pointer hover:text-gray-700">
                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
                    </path>
                  </svg>
                </a>
                <a className="ml-3 text-gray-500 cursor-pointer hover:text-gray-700">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                  </svg>
                </a>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap flex-grow mt-10 -mb-10 text-center md:pl-20 md:mt-0 md:text-left text-sm">
            <div className="w-full px-4 lg:w-full md:w-1/2">
              <nav className="mb-10 list-none">
                <li className="mt-3">
                  <a className="text-gray-500">화물운송주선사업자: 제777호</a>
                </li>
                <li className="mt-3">
                  <a className="text-gray-500">사업자등록번호: 123-12-12345</a>
                </li>
                <li className="mt-3">
                  <a className="text-gray-500">주소: 서울시 광진구 아차산로30길 36(자양동)</a>
                </li>
                <li className="mt-3">
                  <a className="text-gray-500">이용약관 || 개인정보처리방침 || 위치기반서비스이용약관 || 운송약관</a>
                </li>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-gray-300">
          <div className="container px-5 py-4 mx-auto">
            <p className="text-sm text-gray-700 capitalize xl:text-center">© 2024 소소이사(주)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 