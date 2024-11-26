import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';

// GPT 테스트용
export default () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const item = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    prompt = `고객이 이사 중입니다. 이사 전 물품에 대한 포장 방법을 제시해주세요. 물품 설명은 다음과 같습니다.
    "${item.current.value}"
    물품에 대한 포장 방법을 안내해주세요. 주의해야 할 점, 필요한 포장 재료와 방법 등을 구체적으로 설명해주세요`;

    // prompt = `고객이 이사 중입니다. 이사 후 물품 쓰레기 처리 방법을 제시해주세요. 물품 설명은 다음과 같습니다.
    // "${item.current.value}"
    // 물품에 대한 쓰레기 처리 방법을 안내해주세요. 관할 구청 안내 및 재활용 업체 등을 구체적으로 안내해주세요`;

    Meteor.call('openAI.query', prompt, (error, result) => {
      setLoading(false);
      if (error) {
        console.error(error);
      } else {
        setResponse(result);
      }
    });
  };

  return (
    <div>
      <h1>GPT 검색</h1>
      <p>포장방법이 궁금하시면 아래에 물품을 입력 후 검색 버튼을 누르세요.</p>
      <p>도우미봇이 당신의 이사를 위한 유용한 팁을 드립니다.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={item} placeholder="물품을 입력하세요" />
        <button type="submit" disabled={loading}>
          {loading ? '로딩 중...' : '검색'}
        </button>
      </form>
      {response && (
        <div>
          <h2>답변:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};
