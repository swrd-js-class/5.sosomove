import React, { useState } from 'react';
import Gpt from './Gpt';

// 애저 이미지분석 객체탐지
export default () => {
  const [response, setResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [res, setRes] = useState('');
  //파일 업로드
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
  };

  const handleAnalyze = () => {
    <Gpt />
    const prompt = `${JSON.stringify(response)} 이 데이터를 참고하여 사물 이름을 한글로 사물의 추정된 실제 크기를 알고 싶어. 
      형식은 "이사물품: , 대략적인 크기:  cm" 이렇게 해서 결과를 보여주고 사진 촬영시 주의사항도 같이 알려줘`;
    Meteor.call('openAI.query', prompt, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        setRes(result);
      }
    });
  }


  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400">
      <div class="flex flex-col rounded-lg w-[1000px]">
        <div class="w-full px-5 pt-5 pb-5 mx-auto mb-10 text-gray-800 bg-white rounded-lg border">
          <p class="flex items-center justify-center text-center mb-10">
            짐 사진을 첨부해서 업로드하세요 <br />
            사진을 분석해 사진 속 이사물품과 대략적인 사이즈를 알려드립니다<br />
          </p>
          <div class="flex items-center justify-center text-center">
            <input type="file" name="image" onChange={handleUpload} />
          </div>
          {imagePreview &&
            <div class="flex items-center justify-center text-center w-[300px] h-[300px]" >
              <img src={imagePreview} alt="Uploaded preview" class="max-w-full max-h-full object-contain" />
            </div>
          }
        </div>
        <div class="w-full px-5 pt-5 pb-5 mx-auto mb-10 text-gray-800 bg-white rounded-lg border ">
          <button onClick={handleAnalyze} class="bg-green-600 text-white rounded-lg text-lg">분석</button>
          <div>
            <p style={{ whiteSpace: 'pre-line' }}>{res ? (`분석결과: ${res}`) : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};