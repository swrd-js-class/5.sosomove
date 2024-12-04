import React, { useState } from 'react';

//애저 이미지분석 객체 탐지 테스트용
export default () => {
  const [response, setResponse] = useState(null);
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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

  return (
    <div>
      <input type="file" name="image" onChange={handleUpload} />
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};
