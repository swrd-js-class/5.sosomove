import React from "react";

export default () => {
  return (
    <div class='flex flex-col items-center justify-center min-h-screen '>
      <div class='bg-white pb-5 w-full flex justify-center'>
        <img src='/service_img.png' alt='서비스이미지' class="w-[600px] h-[400px]" />
      </div>
      <div class="text-center px-4">
        <b class="text-xl">소소이사</b>에 오신걸 환영합니다!<br />
        소소이사는 소규모 이사 & 도우미 업체를 연결하여 사용자에게 합리적인 가격을 제공하는 플랫폼입니다.<br />
        *이*: 이사 고민은 이제 그만!<br />
        *사*: 사뿐게, 편하게 옮겨드릴게요!<br />
      </div>
    </div>
  );
};
