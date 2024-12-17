import React from "react";

export default () => {
  return (
    <div class='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400 '>
      <div class='w-full flex justify-center'>
        <img src='/truckfix.png' alt='서비스이미지' class="w-[400px] h-[300px] " />
      </div>
      <div class="flex flex-col items-center justify-center text-center w-[800px] h-[200px]">
        <span class="font-bold text-lg">소소이사에 오신걸 환영합니다!</span>
        소소이사는 1인 가구, 소규모 이사, 또는 간단한 물품 이동이 필요한 분들을 위한 이사 서비스 플랫폼입니다.<br />
        소소이사는 용달 & 도우미 업체를 연결하여 사용자에게 합리적인 가격을 제공합니다.<br />
        이사 고민은 이제 그만! 사뿐하게, 편하게 옮겨드릴게요.<br />
        간단한 물품 이동부터 소규모 이사까지, 소소이사와 함께라면 걱정 없이 손쉽게 끝낼 수 있습니다.
      </div>
    </div>
  );
};
