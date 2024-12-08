import React, { useState } from 'react';
import Gpt from './Gpt';

// computer vision
export default () => {

  const [response, setResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [res, setRes] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/ttt', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      console.error('에러:', res.status);
      return;
    }
    const data = await res.json();
    setResponse(data);
    setLoading(true);
  };
  const handleAnalyze = () => {
    setStatus(true);
    <Gpt />
    const prompt = `${JSON.stringify(response)} 이 데이터를 참고하여 사물 이름을 한글로 사물의 추정된 실제 크기를 알고 싶어. 
      형식은 "사물: , 사이즈 가로: cm 세로: cm" 이렇게 결과를 보여주고 사진 촬영시 주의사항을 간단히 알려줘`;
    Meteor.call('openAI.query', prompt, (error, result) => {
      setLoading(false);
      setStatus(false);
      if (error) {
        console.error(error);
      } else {
        setRes(result);
      }
    });
  }

  return (
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400">
      <div class="flex flex-col rounded-lg w-[1000px]">
        <div class="w-full px-5 pt-5 pb-5 mx-auto mb-5 text-gray-800 bg-white rounded-lg">
          <p class="flex items-center justify-center text-center mb-2">
            이삿짐 사진을 첨부해서 업로드하세요. <br />
            이미지 분석을 통해 이사물품을 찾고 대략적인 사이즈를 알려드립니다.
          </p>
          <p class="flex items-center justify-center text-center mb-5 text-sm">
            (파일 업로드 후 사진 하단에 &nbsp;<span class="text-red-500">분석완료</span>가 표시되면 오른편에 분석결과 버튼을 눌러 확인하세요!)
          </p>
        </div>

        <div class="flex flex-row rounded-lg w-[1000px]">
          <div class="w-full px-5 pt-5 pb-5 mx-auto mr-5 text-gray-800 bg-white rounded-lg h-[500px] items-center justify-center">
            <div class="flex items-center justify-center text-center border">
              <input type="file" name="image" onChange={handleUpload} />
            </div>
            <div class="flex items-center justify-center text-center mb-10" >
              {imagePreview &&
                <img src={imagePreview} alt="업로드 이미지" />
              }
            </div>
            <div class="text-center text-red-500 font-bold">
              {loading ? (
                <p>분석완료</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div class="w-full px-5 pt-5 pb-5 mx-auto text-gray-800 bg-white rounded-lg border ">
            <div className="flex justify-end">
              <button disabled={status} onClick={handleAnalyze} class="px-3 py-1 bg-green-600 text-white rounded-lg text-lg shadow-md hover:from-green-500 hover:to-green-700 disabled:opacity-50 disabled:bg-green-300 transition-all duration-200 mb-10">분석결과 확인</button>
            </div>
            <div>
              <p style={{ whiteSpace: 'pre-line' }}>{res ? res : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};