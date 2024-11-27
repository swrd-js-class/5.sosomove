import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';

// 포장도우미AI-GPT
export default () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const item = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prompt = `이사 중 포장 방법을 제시해주세요. 다음은 포장해야 할 물품입니다.
    "${item.current.value}"
    물품에 대한 포장 방법을 안내해주세요. 주의해야 할 점, 필요한 포장 재료와 방법 등을 구체적으로 설명해주세요`;

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
      {/* <div>
        <p>포장방법이 궁금하시면 아래에 물품을 입력 후 검색 버튼을 누르세요.</p>
        <p>도우미봇이 당신의 이사를 위한 유용한 팁을 드립니다.</p><br />
        <form onSubmit={handleSubmit}>
          <input type="text" ref={item} placeholder="물품을 입력하세요" />
          <button type="submit" disabled={loading}>
            {loading ? '로딩 중...' : '검색'}
          </button>
        </form>
      </div>
      {response && (
        <div>
          <h2>답변:</h2>
          <p>{response}</p>
        </div>
      )} */}


      {/* css추가 */}
      <div class="flex items-center justify-center px-5 py-5 min-h-screen from-sky-100 via-sky-300 to-sky-500 bg-gradient-to-br">
        <div class="flex flex-col from-sky-100 via-sky-300 to-sky-500 bg-gradient-to-br rounded-lg ">
          <div class="w-full max-w-xl px-5 pt-5 pb-5 mx-auto mb-10 text-gray-800 bg-white rounded-lg border">
            <p class="text-center">
              포장방법이 궁금하시면 아래에 물품을 입력 후 검색 버튼을 누르세요.<br />
              포장도우미AI가 당신의 이사를 위한 '유용한 팁'을 드립니다.
            </p><br />
            <form onSubmit={handleSubmit} class="flex justify-center">
              <div class="flex items-center space-x-2">
                <input type="text" ref={item} class="rounded-lg border appearance-none border border-gray-300 w-50 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="물품을 입력하세요" />
                <button type="submit" disabled={loading} class="px-3 py-1 bg-green-600 text-white rounded-lg text-lg shadow-md hover:from-green-500 hover:to-green-700 disabled:opacity-50 disabled:bg-green-300 transition-all duration-200">
                  {loading ? '로딩 중...' : '검색'}
                </button>
              </div>
            </form>
          </div>

          <div class="w-full max-w-xl px-5 pt-5 pb-10 mx-auto text-gray-800 bg-white rounded-lg border">
            <div class="w-full pt-1 pb-5 mx-auto -mt-16 text-center">
              <img alt="AI-bot" src="/AI.png" class="mx-auto object-cover rounded-full h-20 w-20 " />
            </div>
            <div class="w-full mb-10">
              <div class="h-3 text-3xl leading-tight text-left text-indigo-500">
                “
              </div>
              {response ? (
                <p class="px-5 text-base text-center text-gray-600 dark:text-gray-100">
                  {response}
                </p>
              ) : (
                <p class="px-5 text-base text-center text-gray-600 dark:text-gray-100">
                  ...
                </p>
              )}
              <div class="h-3 -mt-3 text-3xl leading-tight text-right text-indigo-500">
                ”
              </div>
            </div>
            <div class="w-full">
              <p class="font-bold text-center text-indigo-500 text-md">
                위 사항을 참고해주세요!
              </p>
              <p class="text-xs text-center text-gray-500 dark:text-gray-300">
                @포장도우미AI
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
