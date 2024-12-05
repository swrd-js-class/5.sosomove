import React, { useState } from 'react';
import Gpt from './Gpt';

// 애저 이미지 분석 객체 탐지 테스트용
export default () => {
  const [response, setResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기를 위한 상태
  const [res, setRes] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 이미지 미리보기 설정
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
    const prompt = `${JSON.stringify(response)} 이 데이터를 참고해서 사물 이름을 한국어로 번역해서 결과만 보여주고, 추정된 실제 크기를 계산 과정 생략 후 결과만 보여줘. 보여줄때 형식은 "이사물품: , 대략크기:  " 이런 형식으로 보여줘`;
    Meteor.call('openAI.query', prompt, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        setRes(result);
      }
    });
  };

  return (
    <div>
      <input type="file" name="image" onChange={handleUpload} />
      {imagePreview && <img src={imagePreview} alt="Uploaded preview" style={{ width: '300px', marginTop: '10px' }} />}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      <button onClick={handleAnalyze} class="border bg-red-300">분석</button>
      <p style={{ whiteSpace: 'pre-line' }}>{res ? res : ''}</p>
    </div>
  );
};