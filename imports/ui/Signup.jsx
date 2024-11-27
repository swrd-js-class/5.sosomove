import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

//회원가입 유형
export default () => {
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);
  const [status, setStatus] = useState('none');

  const handleButtonClick = (e) => {
    setStatus(e);
    setShowImage(false);
    if (e === '일반') {
      navigate('/signupdetail/일반');
    } else if (e === '사업자') {
      navigate('/signupdetail/사업자');
    }
  };

  return (
    <>
      {showImage && (
        <div class='flex items-center justify-center min-h-screen from-sky-100 via-sky-300 to-sky-500 bg-gradient-to-br'>
          <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
            <div class='max-w-md mx-auto space-y-6'>
              <div class="space-y-4">
                <p class="text-lg font-medium text-center text-neutral-900">회원가입 유형을 선택하세요</p>
                <div class="relative " onClick={() => handleButtonClick('일반')}>
                  <label for="option1-checkbox" class="inline-flex items-center justify-between w-full p-5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-100 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50">
                    <div class="flex items-center space-x-5">
                      <svg class="w-16 h-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M224 56v122.06l-39.72-39.72a8 8 0 0 0-11.31 0L147.31 164l-49.65-49.66a8 8 0 0 0-11.32 0L32 168.69V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8" opacity="0.2" /><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></g></svg>
                      <div class="flex flex-col justify-start">
                        <div class="w-full text-lg font-semibold" >일반회원</div>
                      </div>
                    </div>
                  </label>
                </div>
                <div class="relative" onClick={() => handleButtonClick('사업자')}>
                  <label for="option2-checkbox" class="inline-flex items-center justify-between w-full p-5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-100 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50">
                    <div class="flex items-center space-x-5">
                      <svg class="w-16 h-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M224 56v122.06l-39.72-39.72a8 8 0 0 0-11.31 0L147.31 164l-49.65-49.66a8 8 0 0 0-11.32 0L32 168.69V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8" opacity="0.2" /><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></g></svg>
                      <div class="flex flex-col justify-start">
                        <div class="w-full text-lg font-semibold" >사업자회원</div>
                        <div class="w-full text-sm opacity-60">(용달사업자&헬퍼사업자)</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};