import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

//이미지분석 객체 탐지 테스트용
export default () => {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    try {
      const analysisResult = await new Promise((resolve, reject) => {
        Meteor.call('azure.analyzeImage', imageUrl, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
      console.log(analysisResult);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    <div>
      <h1>애저 컴퓨터 비전</h1>
      <input type="text" placeholder="URL 입력" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button onClick={handleAnalyze}>이미지분석</button>

      {result && (
        <div>
          <h3>분석결과</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};