//개인-견적요청서 수정
import React, { useEffect, useState, useRef } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from "react-router-dom";
import "/lib/utils.js";

export default () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = Meteor.userId(); //현재 로그인한 사용자의 userId 조회

  const [selectedDate, setSelectedDate] = useState(null);
  const [proposer, setProposer] = useState(''); //신청자
  const [addWorker, setAddWorker] = useState(false); //용달 추가인력
  const [moveDate, setMoveDate] = useState(''); //이사날짜
  const [moveDateData, setMoveDateData] = useState('');
  const [activeTab, setActiveTab] = useState('car');
  const [selectedTime, setSelectedTime] = useState(''); //도착요청시간-헬퍼
  const [carSelectedTime, setCarSelectedTime] = useState(''); //도착요청시간-용달
  const [sAddrEv, setSAddrEv] = useState(false); //출발지-엘레베이터 여부
  const [aAddrEv, setAAddrEv] = useState(false); //도착지-엘레베이터 여부
  const [times, setTimes] = useState([]);
  const timesArr = [];
  const [appliances, setAppliances] = useState([]); //가전 체크된 목록
  const [furnitures, setFurnitures] = useState([]); //가전 체크된 목록
  const [carContent, setCarContent] = useState(''); //상세내역
  const [selectedTimeArea, setSelectedTimeArea] = useState(''); //오전/오후/하루 옵션
  const [selHelpOption, setSelHelpOption] = useState(false); //모두,짐싸기,짐풀기 옵션
  const [s_house_size, setShouseSize] = useState(0);
  const [a_house_size, setAhouseSize] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const carTextareaRef = useRef();


  //주소찾기
  const [startPostcode, setStartPostcode] = useState('');
  const [startAddress, setStartAddress] = useState('');

  const [arrPostcode, setArrPostcode] = useState('');
  const [arrAddress, setArrAddress] = useState('');

  //request테이블에서 견적서내용 리스트 뽑기
  const [reqDetail, setReqDetail] = useState([]);

  //날짜
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  // useState로 가전, 가구 체크박스 상태를 관리
  const [checkedItems, setCheckedItems] = useState([]);

  //가전, 가구 목록
  const items = {
      appliances: [
          { name: '냉장고', index: 'a' },
          { name: '김치냉장고', index: 'b' },
          { name: '세탁기', index: 'c' },
          { name: '건조기', index: 'd' },
          { name: 'TV모니터', index: 'e' },
          { name: '에어컨', index: 'f' },
          { name: '의류관리기', index: 'g' },
          { name: '안마의자', index: 'h' },
          { name: '전자레인지', index: 'i' },
          { name: '가스레인지', index: 'j' },
          { name: '인덕션', index: 'k' },
          { name: '공기청정기', index: 'l' },
          { name: '청소기', index: 'm' },
          { name: '정수기', index: 'n' },
          { name: '비데', index: 'o' },
          { name: 'PC데스크탑', index: 'p' },
      ],
      furnitures: [
          { name: '침대메트리스', index: 'q' },
          { name: '침대프레임', index: 'r' },
          { name: '책상', index: 's' },
          { name: '의자', index: 't' },
          { name: '소파', index: 'u' },
          { name: '테이블', index: 'v' },
          { name: '수납장', index: 'w' },
          { name: '서랍장', index: 'x' },
          { name: '책장', index: 'y' },
          { name: '옷장', index: 'z' },
          { name: '화장대', index: 'aa' },
          { name: '헹거', index: 'bb' },
      ]
  };

  //도우미 옵션
  const helperOption = {
      package : [
          { name: '짐 싸기 / 짐 풀기 모두 원해요', id : 'all', value : '모두'},
          { name: '짐 싸기 원해요', id : 'pack', value : '짐싸기'},
          { name: '짐 풀기 원해요', id : 'unpack', value : '짐풀기'},
      ],
      timearea : [
          { name: '오전', id : 'am'},
          { name: '오후', id : 'pm'},
          { name: '하루', id : 'day'},
      ] 
  }

  function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {

    //내 견적요청서 조회
    Meteor.call('requestDetailCall', { param: id }, (err, result) => {

      if (err) {
        console.log(err);
        return;
      }
      setReqDetail(result);
    });

    //시간목록 set
    for (let i = 0; i <= 23; i++) {
      timesArr.push(`${i.toString().padStart(2, '0')}:00`);
    };

    setTimes(timesArr);

    //주소찾기
    // 카카오 우편번호 API 스크립트 로드
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      console.log("카카오 우편번호 API 로드 완료");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };


  }, []);

  useEffect(() => {
    //조회된 데이터 초기 set
    dataSet();
  }, [reqDetail])

  // 우편번호 찾기 실행 함수
  const handlePostcodeSearch = (type) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = '';
        let extraAddr = '';

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져오기
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress; // 도로명 주소
        } else {
          addr = data.jibunAddress; // 지번 주소
        }

        if (type === 'start') {
          setStartPostcode(data.zonecode); // 우편번호
          setStartAddress(addr); // 주소
          // setDetailStartAddress(''); // 상세 주소 초기화
        } else if (type === 'arr') {
          setArrPostcode(data.zonecode); //우편번호
          setArrAddress(addr); //주소
          // setDetailArrAddress(''); //상세 주소 초기화
        }
      }
    }).open();
  };

  //조회한 초기 데이터 각 항목에 set
  const dataSet = () => {

    reqDetail.map((data) => {

      setProposer(data.user_name); //신청자명
      setStartAddress(data.start_address);//출발지-주소
      setArrAddress(data.arrive_address);//도착지-주소
      //setMoveDate(data.move_date.toStringYMD()); //이사날짜
      setSelectedDate(data.move_date);
      setMoveDateData(data.move_date);
      setAddWorker(data.addworker);//추가용달인원 true/false
      //용달 내용
      setAppliances(data.reqCar.appliances); //가전
      setFurnitures(data.reqCar.furniture);//가구
      setCarSelectedTime(data.reqCar.req_arr_time);//도착요청시간
      setSAddrEv(data.reqCar.str_addr_elv);//출발지 elv
      setAAddrEv(data.reqCar.arr_addr_elv);//도착지 elv
      setCarContent(data.reqCar.detail);//추가내용
      //헬퍼내용
      setSelectedTimeArea(data.reqHelper.request_time_area);//요청시간대
      setSelHelpOption(data.reqHelper.h_type);//요청사항
      setSelectedTime(data.reqHelper.h_req_arr_time);//도착요청시간
      setShouseSize(data.reqHelper.s_house_size);//출발집-평수
      setAhouseSize(data.reqHelper.a_house_size);//도착집-평수
    });
  }

  //신청자
  const handleProposerChange = (e) => {
    setProposer(e.target.value);
  }

  //용달 추가인력 필요 여부
  const handleAddworkerChange = () => {
    setAddWorker(!isChecked);
  }

  //용달/헬퍼 탭 클릭 시
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  //시간 변경 시 - 헬퍼
  const handleTimeChanged = (e) => {
    setSelectedTime(e.target.value);
  }

  //시간 변경 시 - 용달
  const handleCarTimeChanged = (e) => {
    setCarSelectedTime(e.target.value);
  }

  //도우미 탭-요청시간대 선택 시
  const handleTimeAreaChanged = (e) => {
    setSelectedTimeArea(e.target.value);
  }

  //집 평수 변경-출발
  const handleShouseSize = (e) => {
    setShouseSize(e.target.value);
  }

  //집 평수 변경-도착
  const handleAhouseSize = (e) => {
    setAhouseSize(e.target.value);
  }

  //용달-상세내역
  const handleCarContentChange = () => {
    setCarContent(carTextareaRef.current.value);
  }

  //짐싸기, 짐풀기, 모두 옵션 선택
  const handleHelpOptionChange = (e) => {
    setSelHelpOption(e.target.value);
  }

  //날짜 검증
  const handleDateChange = (date) => {
    if(date === null) {
        setSelectedDate(null);
    }

    if (date) {
        if (date < today) {
            alert('오늘보다 이전의 날짜는 선택할 수 없습니다!');
            setSelectedDate(null);
        }
        //선택한 날짜가 오늘로부터 일주일 이내라면
        else if (date && date <= oneWeekLater) {
            alert('오늘로부터 일주일 이내의 날짜는 선택할 수 없습니다!');
            setSelectedDate(null);
        } else {
            setSelectedDate(date);
        }
    }
  };


  //체크된 가전 목록 set
  const toggleCheckboxAppli = (name, isChecked) => {
    setAppliances((prev) => {
      if (isChecked) {
        return [...prev, name];  // 선택된 값 추가
      } else {
        return prev.filter(item => item !== name);  // 선택 해제된 값 제거
      }
    });
  }

  //체크된 가구 목록 set
  const toggleCheckboxFurni = (name, isChecked) => {
    setFurnitures((prev) => {
      if (isChecked) {
        return [...prev, name];  // 선택된 값 추가
      } else {
        return prev.filter(item => item !== name);  // 선택 해제된 값 제거
      }
    });
  }

  //출발지, 도착지 엘레베이터 유무
  const handleEvChange = (type) => {
    if (type === 'str') setSAddrEv((prev) => !prev);
    else if (type === 'arr') setAAddrEv((prev) => !prev);
  }

  //견적서 제출
  const handleSubmit = () => {
    const isconfirm = window.confirm("저장하시겠습니까?");

    if (isconfirm) {

      const jsonRequestData = {
        user_name: proposer,
        move_date: selectedDate !== null ? selectedDate : moveDateData,
        start_address: startAddress,
        arrive_address: arrAddress,
        house_size: s_house_size,
        addworker: addWorker,
        reqCar: {
          req_arr_time: carSelectedTime,
          str_addr_elv: sAddrEv,
          arr_addr_elv: aAddrEv,
          appliances: appliances,
          furniture: furnitures,
          detail: carContent,
          car_confirm_id: null
        },
        reqHelper: {
          request_time_area: selectedTimeArea,
          h_type: selHelpOption,
          h_req_arr_time: selectedTime,
          s_house_size: s_house_size,
          a_house_size: a_house_size,
          hel_confirm_id: null
        },
        createdAt: new Date()
      }

      //db update
      Meteor.call('updateRequest', id, jsonRequestData, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log("update success!!");
        alert("견적 요청서가 저장되었습니다.");

        //상세페이지로 페이지 이동
        navigate(`/mypage/requestdetail/${id}`);
      })
    } else {
      console.log("취소");
      return;
    }
  }

  return (
    <>
      <div style={{ float: 'left' }}>
        <form>
          <div className="space-y-12 pl-2">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">견적 신청서 수정</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                <p className="relative pl-6">
                                    <span className="absolute left-0 top-0 text-red-500">*</span>
                                    신청자
                                </p>
                                </label>
                                <div className="mt-2">
                                  <input
                                  id="username" 
                                  type="text" 
                                  placeholder="필수입력"
                                  value={proposer} 
                                  onChange={handleProposerChange} 
                                  className="block min-w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                            </div>
                        </div>
                    
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                    <p className="relative pl-6">
                                        <span className="absolute left-0 top-0 text-red-500">*</span>
                                        출발지
                                    </p>
                                </label>
                                <div class="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={startPostcode}
                                    placeholder="우편번호"
                                    className="block w-[100px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePostcodeSearch('start')}
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  >우편번호 찾기</button>
                                </div>

                                <div class="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={startAddress}
                                  className="block w-[500px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  placeholder="주소"
                                />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                    <p className="relative pl-6">
                                        <span className="absolute left-0 top-0 text-red-500">*</span>
                                        도착지
                                    </p>
                                </label>
                                <div class="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={arrPostcode}
                                    placeholder="우편번호"
                                    className="block w-[100px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    onClick={() => handlePostcodeSearch('arr')}
                                  >우편번호 찾기
                                  </button>
                                </div>

                                <div class="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={arrAddress}
                                    className="block w-[500px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    placeholder="주소"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-4">
                                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                    <p className="relative pl-6">
                                        <span className="absolute left-0 top-0 text-red-500">*</span>
                                        이사 날짜
                                    </p>
                                </label>
                                <DatePicker
                                  selected={selectedDate}
                                  onChange={handleDateChange} //날짜 검증
                                  dateFormat="yyyy.MM.dd" // 원하는 날짜 형식 설정
                                  isClearable // 선택 해제 버튼 추가
                                  className="block min-w-[200px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  placeholderText="&#128198; 0000.00.00"
                                />
                              </div>

                              <div className="sm:col-span-4">
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900"> 
                                      용달 인부 추가 여부
                                    </label>
                                    <input 
                                    type="checkbox" 
                                    name="addWorker" 
                                    checked={addWorker} 
                                    onChange={() => handleAddworkerChange(isChecked)} 
                                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" 
                                    />
                                </div>
                              </div>                                    
                            </div>
                          </div>
          </div>
        </form>
      </div>
      
      <div style={{ float: 'right' }} >
        <h2>이사물품 입력</h2>
        <div>
          <button
            onClick={() => handleTabClick('car')}
            style={{ fontWeight: activeTab === 'car' ? 'bold' : 'normal' }}
          >
            용달_요청사항
          </button>
          <button
            onClick={() => handleTabClick('helper')}
            style={{ fontWeight: activeTab === 'helper' ? 'bold' : 'normal' }}
          >
            도우미_요청사항
          </button>
        </div>
        <div style={{ marginTop: '20px' }} >
          {activeTab === 'car' ? (
            <div>
              <p>물품선택</p>
              <div>
                <p>가전</p>

                <label for="a">냉장고&nbsp; <input type="checkbox" id="a" value='냉장고' checked={appliances.includes('냉장고')} onChange={(e) => toggleCheckboxAppli('냉장고', e.target.checked)} /></label> &nbsp;
                <label for="b">김치냉장고&nbsp; <input type="checkbox" id="b" value='김치냉장고' checked={appliances.includes('김치냉장고')} onChange={(e) => toggleCheckboxAppli('김치냉장고', e.target.checked)} /></label>&nbsp;
                <label for="c">세탁기&nbsp; <input type="checkbox" id="c" value='세탁기' checked={appliances.includes('세탁기')} onChange={(e) => toggleCheckboxAppli('세탁기', e.target.checked)} /></label>&nbsp;
                <label for="d">건조기&nbsp; <input type="checkbox" id="d" value='건조기' checked={appliances.includes('건조기')} onChange={(e) => toggleCheckboxAppli('건조기', e.target.checked)} /></label>&nbsp;

                <label for="e">TV모니터&nbsp; <input type="checkbox" id="e" value='TV모니터' checked={appliances.includes('TV모니터')} onChange={(e) => toggleCheckboxAppli('TV모니터', e.target.checked)} /></label>&nbsp;
                <label for="f">에어컨&nbsp; <input type="checkbox" id="f" value='에어컨' checked={appliances.includes('에어컨')} onChange={(e) => toggleCheckboxAppli('에어컨', e.target.checked)} /></label>&nbsp;
                <label for="g">의류관리기&nbsp; <input type="checkbox" id="g" value='의류관리기' checked={appliances.includes('의류관리기')} onChange={(e) => toggleCheckboxAppli('의류관리기', e.target.checked)} /></label>&nbsp;
                <label for="h">안마의자&nbsp; <input type="checkbox" id="h" value='안마의자' checked={appliances.includes('안마의자')} onChange={(e) => toggleCheckboxAppli('안마의자', e.target.checked)} /></label>&nbsp;

                <label for="i">전자레인지&nbsp; <input type="checkbox" id="i" value='전자레인지' checked={appliances.includes('전자레인지')} onChange={(e) => toggleCheckboxAppli('전자레인지', e.target.checked)} /></label>&nbsp;
                <label for="j">가스레인지&nbsp; <input type="checkbox" id="j" value='가스레인지' checked={appliances.includes('가스레인지')} onChange={(e) => toggleCheckboxAppli('가스레인지', e.target.checked)} /></label>&nbsp;
                <label for="k">인덕션&nbsp; <input type="checkbox" id="k" value='인덕션' checked={appliances.includes('인덕션')} onChange={(e) => toggleCheckboxAppli('인덕션', e.target.checked)} /></label>&nbsp;
                <label for="l">공기청정기&nbsp; <input type="checkbox" id="l" value='공기청정기' checked={appliances.includes('공기청정기')} onChange={(e) => toggleCheckboxAppli('공기청정기', e.target.checked)} /></label>&nbsp;

                <label for="m">청소기&nbsp; <input type="checkbox" id="m" value='청소기' checked={appliances.includes('청소기')} onChange={(e) => toggleCheckboxAppli('청소기', e.target.checked)} /></label>&nbsp;
                <label for="n">정수기&nbsp; <input type="checkbox" id="n" value='정수기' checked={appliances.includes('정수기')} onChange={(e) => toggleCheckboxAppli('정수기', e.target.checked)} /></label>&nbsp;
                <label for="o">비데&nbsp; <input type="checkbox" id="o" value='비데' checked={appliances.includes('비데')} onChange={(e) => toggleCheckboxAppli('비데', e.target.checked)} /></label>&nbsp;
                <label for="p">PC데스크탑&nbsp; <input type="checkbox" id="p" value='PC데스크탑' checked={appliances.includes('PC데스크탑')} onChange={(e) => toggleCheckboxAppli('PC데스크탑', e.target.checked)} /></label>&nbsp;


                <p>선택된 가전 제품: {appliances.join(', ')}</p>
              </div>
              <div>
                <p>가구</p>
                <label for="q">침대메트리스&nbsp; <input type="checkbox" id="q" value='침대메트리스' checked={furnitures.includes('침대메트리스')} onChange={(e) => toggleCheckboxFurni('침대메트리스', e.target.checked)} /></label>&nbsp;
                <label for="r">침대프레임&nbsp; <input type="checkbox" id="r" value='침대프레임' checked={furnitures.includes('침대프레임')} onChange={(e) => toggleCheckboxFurni('침대프레임', e.target.checked)} /></label>&nbsp;
                <label for="s">책상&nbsp; <input type="checkbox" id="s" value='책상' checked={furnitures.includes('책상')} onChange={(e) => toggleCheckboxFurni('책상', e.target.checked)} /></label>&nbsp;
                <label for="t">의자&nbsp; <input type="checkbox" id="t" value='의자' checked={furnitures.includes('의자')} onChange={(e) => toggleCheckboxFurni('의자', e.target.checked)} /></label>&nbsp;

                <label for="u">소파&nbsp; <input type="checkbox" id="u" value='소파' checked={furnitures.includes('소파')} onChange={(e) => toggleCheckboxFurni('소파', e.target.checked)} /></label>&nbsp;
                <label for="v">테이블&nbsp; <input type="checkbox" id="v" value='테이블' checked={furnitures.includes('테이블')} onChange={(e) => toggleCheckboxFurni('테이블', e.target.checked)} /></label>&nbsp;
                <label for="w">수납장&nbsp; <input type="checkbox" id="w" value='수납장' checked={furnitures.includes('수납장')} onChange={(e) => toggleCheckboxFurni('수납장', e.target.checked)} /></label>&nbsp;
                <label for="x">서랍장&nbsp; <input type="checkbox" id="x" value='서랍장' checked={furnitures.includes('서랍장')} onChange={(e) => toggleCheckboxFurni('서랍장', e.target.checked)} /></label>&nbsp;

                <label for="y">책장&nbsp; <input type="checkbox" id="y" value='책장' checked={furnitures.includes('책장')} onChange={(e) => toggleCheckboxFurni('책장', e.target.checked)} /></label>&nbsp;
                <label for="z">옷장&nbsp; <input type="checkbox" id="z" value='옷장' checked={furnitures.includes('옷장')} onChange={(e) => toggleCheckboxFurni('옷장', e.target.checked)} /></label>&nbsp;
                <label for="aa">화장대&nbsp; <input type="checkbox" id="aa" value='화장대' checked={furnitures.includes('화장대')} onChange={(e) => toggleCheckboxFurni('화장대', e.target.checked)} /></label>&nbsp;
                <label for="bb">행거&nbsp; <input type="checkbox" id="bb" value='행거' checked={furnitures.includes('행거')} onChange={(e) => toggleCheckboxFurni('행거', e.target.checked)} /></label>&nbsp;

                <p>선택된 가구 목록: {furnitures.join(', ')}</p>
              </div>
              <div>
                <p>도착요청시간 :&nbsp;
                  <select value={carSelectedTime} onChange={handleCarTimeChanged}>
                    {times.map((time) => (
                      <option key={time} value={time} >
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
                <p>
                  출발지-e/v : 있음&nbsp;
                  <input
                    type="radio"
                    name="sAddrEv"
                    value={true}
                    checked={sAddrEv === true}
                    onChange={() => handleEvChange('str')}
                  ></input>&nbsp;
                  없음&nbsp;
                  <input
                    type="radio"
                    name="sAddrEv"
                    value={false}
                    checked={sAddrEv === false}
                    onChange={() => handleEvChange('str')}
                  ></input>&nbsp;
                </p>
                <p>
                  도착지-e/v : 있음&nbsp;
                  <input
                    type="radio"
                    name="aAddrEv"
                    value={true}
                    checked={aAddrEv === true}
                    onChange={() => handleEvChange('arr')}
                  ></input>&nbsp;
                  없음&nbsp;
                  <input
                    type="radio"
                    name="aAddrEv"
                    value={false}
                    checked={aAddrEv === false}
                    onChange={() => handleEvChange('arr')}
                  ></input>&nbsp;
                </p>
              </div>
              
              <div>
                <p>추가 내용 입력</p>
                <textarea
                  ref={carTextareaRef}
                  value={carContent}
                  onChange={handleCarContentChange}
                  rows="4"
                  col="50">
                </textarea>
              </div>
            </div>
          ) : (
            <div>
              <p>도우미 요청사항</p>
              <div>
                <p>짐 싸기/풀기 모두 원해요&nbsp;
                  <input
                    name="helpOption"
                    type="radio"
                    value='모두'
                    checked={selHelpOption === '모두'}
                    onChange={handleHelpOptionChange}>
                  </input>
                </p>
                <p>짐 풀기만 원해요&nbsp;
                  <input
                    name="helpOption"
                    type="radio"
                    value='짐풀기'
                    checked={selHelpOption === '짐풀기'}
                    onChange={handleHelpOptionChange}>
                  </input>
                </p>
                <p>짐 싸기만 원해요&nbsp;
                  <input
                    name="helpOption"
                    type="radio"
                    value='짐싸기'
                    checked={selHelpOption === '짐싸기'}
                    onChange={handleHelpOptionChange}>
                  </input>
                </p>
              </div>
              <div>
                <p>요청시간대 :&nbsp;
                  <input
                    name="timeArea"
                    type="radio"
                    value='오전'
                    checked={selectedTimeArea === '오전'}
                    onChange={handleTimeAreaChanged} />
                  &nbsp;오전&nbsp;

                  <input
                    name="timeArea"
                    type="radio"
                    value='오후'
                    checked={selectedTimeArea === '오후'}
                    onChange={handleTimeAreaChanged} />
                  &nbsp;오후&nbsp;

                  <input
                    name="timeArea"
                    type="radio"
                    value='하루'
                    checked={selectedTimeArea === '하루'}
                    onChange={handleTimeAreaChanged} />
                  &nbsp;하루&nbsp;

                </p>
                <p>도착요청시간 :&nbsp;
                  <select value={selectedTime} onChange={handleTimeChanged}>
                    {times.map((time) => (
                      <option key={time} value={time} >
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
              </div>
              <div>
                <p>면적(평수) :&nbsp;
                  출발 :&nbsp; <input type="number" value={s_house_size} onChange={handleShouseSize}></input>,&nbsp;
                  도착 :&nbsp; <input type="number" value={a_house_size} onChange={handleAhouseSize}></input> </p>
              </div>
            </div>
          )}
        </div>
        <div>
          <button onClick={handleSubmit}>견적요청서 수정</button>
        </div>
      </div>
    </>
  )
}