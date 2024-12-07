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
    setIsChecked(!isChecked);
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
        // createdAt: new Date()
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
      
      <div style={{ float: 'left' }} >
        <div className="pl-2" >
          <div className="hidden sm:block">
            <div aria-label="Tabs" className="flex space-x-4">
              <button
                onClick={() => handleTabClick('car')}
                className={classNames(
                  activeTab === 'car' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
                  'rounded-md px-3 py-2 text-sm font-medium',
                )}
              >
                용달_요청사항
              </button>
              <button
                onClick={() => handleTabClick('helper')}
                className={classNames(
                  activeTab === 'helper' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
                  'rounded-md px-3 py-2 text-sm font-medium',
                )}
              >
                도우미_요청사항
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }} >
          {activeTab === 'car' ? (
            <div>
              <div>
              <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
                  <legend className="font-bold text-lg mb-2">가전 제품</legend>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {items.appliances.map((apll) => (
                      <label key={apll.index} for={apll.index} className="mb-2">
                        <input type="checkbox"
                          className={classNames(
                            'cursor-pointer focus:outline-none', // 기본 상태 스타일
                            'peer hidden', // 체크박스 숨기기, peer 클래스를 통해 label과 연결
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50'
                          )}
                          id={apll.index}
                          value={apll.name}
                          checked={appliances.includes(apll.name)} //체크 상태에 맞게
                          onChange={(e) => toggleCheckboxAppli(apll.name, e.target.checked)}
                          style={{ display: 'none' }} />
                        <span
                          className={classNames(
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50', // 기본 스타일
                            'peer-checked:border-transparent peer-checked:bg-gray-400 peer-checked:text-white', // 체크된 상태에서 스타일 변경
                            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2' // 포커스 스타일
                          )}
                        >{apll.name}</span>
                      </label>
                    ))}

                  </div>
                </fieldset>
              </div>

              <div>
              <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
                  <legend className="font-bold text-lg mb-2">가구</legend>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {items.furnitures.map((furniture) => (
                      <label for={furniture.index} className="mb-2">
                        <input type="checkbox"
                          className={classNames(
                            'cursor-pointer focus:outline-none', // 기본 상태 스타일
                            'peer hidden', // 체크박스 숨기기, peer 클래스를 통해 label과 연결
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50'
                          )}
                          id={furniture.index}
                          value={furniture.name}
                          checked={furnitures.includes(furniture.name)} //체크 상태에 맞게
                          onChange={(e) => toggleCheckboxFurni(furniture.name, e.target.checked)}
                          style={{ display: 'none' }} />
                        <span
                          className={classNames(
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50', // 기본 스타일
                            'peer-checked:border-transparent peer-checked:bg-gray-400 peer-checked:text-white', // 체크된 상태에서 스타일 변경
                            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2' // 포커스 스타일
                          )}
                        >{furniture.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <div className="mt-5 sm:col-span-3">
                  <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                    <p className="relative pl-6">
                      <span className="absolute left-0 top-0 text-red-500">*</span>
                      도착요청시간 :&nbsp;
                    </p>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={carSelectedTime}
                      onChange={handleCarTimeChanged}
                      className="col-start-1 row-start-1 w-[100px] appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      {times.map((time) => (
                        <option key={time} value={time} >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <fieldset>
                    <legend className="block text-sm/6 font-medium text-gray-900">출발지 Elevator</legend>
                    <div className="mt-1 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <label for="sAddrEvY" className="block text-sm/6 font-medium text-gray-900">
                          <input
                            type="radio"
                            name="sAddrEv"
                            id="sAddrEvY"
                            value={true}
                            checked={sAddrEv === true}
                            onChange={() => handleEvChange('str')}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                          />
                          &nbsp;있음
                        </label>

                        <label for="sAddrEvN" className="block text-sm/6 font-medium text-gray-900">
                          <input
                            type="radio"
                            id="sAddrEvN"
                            name="sAddrEv"
                            value={false}
                            checked={sAddrEv === false}
                            onChange={() => handleEvChange('str')}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                          />
                          &nbsp;없음
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="mt-5">
                  <fieldset>
                    <legend className="block text-sm/6 font-medium text-gray-900">도착지 Elevator</legend>
                    <div className="mt-1 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <label for="aAddrEvY" className="block text-sm/6 font-medium text-gray-900">
                          <input
                            type="radio"
                            name="aAddrEv"
                            id="aAddrEvY"
                            value={true}
                            checked={aAddrEv === true}
                            onChange={() => handleEvChange('arr')}
                          />
                          &nbsp;있음
                        </label>

                        <label for="aAddrEvN" className="block text-sm/6 font-medium text-gray-900">
                          <input
                            type="radio"
                            name="aAddrEv"
                            id="aAddrEvN"
                            value={false}
                            checked={aAddrEv === false}
                            onChange={() => handleEvChange('arr')}
                          />
                          &nbsp;없음
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              
              <div className="mt-5 sm:col-span-3">
                <label className="block text-sm/6 font-medium text-red-500 relative">
                  ** 추가 입력 사항 : 2개 이상인 물품은 반드시 입력해 주세요!! **
                </label>
                <textarea
                  ref={carTextareaRef}
                  value={carContent}
                  onChange={handleCarContentChange}
                  id="about"
                  name="about"
                  rows={3}
                  defaultValue={''}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                </textarea>
              </div>
            </div>
          ) : (
              <div>
                <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
                  <legend className="font-bold text-lg mb-2">요청사항</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {helperOption.package.map((pack) => (
                      <label for={pack.id} className="mb-2">
                        <input
                          type="radio"
                          name="helpOption"
                          id={pack.id}
                          className={classNames(
                            'cursor-pointer focus:outline-none', // 기본 상태 스타일
                            'peer hidden', // 체크박스 숨기기, peer 클래스를 통해 label과 연결
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50'
                          )}
                          value={pack.value} checked={selHelpOption === pack.value} onChange={handleHelpOptionChange} style={{ display: 'none' }} />
                        <span
                          className={classNames(
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50', // 기본 스타일
                            'peer-checked:border-transparent peer-checked:bg-gray-400 peer-checked:text-white', // 체크된 상태에서 스타일 변경
                            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2' // 포커스 스타일
                          )}
                        >{pack.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              
                <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
                  <legend className="font-bold text-lg mb-2">요청 시간대</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {helperOption.timearea.map((time) => (
                      <label for={time.id} className="mb-2">
                        <input
                          type="radio"
                          name="timeArea"
                          id={time.id}
                          className={classNames(
                            'cursor-pointer focus:outline-none', // 기본 상태 스타일
                            'peer hidden', // 체크박스 숨기기, peer 클래스를 통해 label과 연결
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50'
                          )}
                          value={time.name} checked={selectedTimeArea === time.name} onChange={handleTimeAreaChanged} style={{ display: 'none' }} />
                        <span
                          className={classNames(
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50', // 기본 스타일
                            'peer-checked:border-transparent peer-checked:bg-gray-400 peer-checked:text-white', // 체크된 상태에서 스타일 변경
                            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2' // 포커스 스타일
                          )}
                        >{time.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 sm:col-span-3">
                  <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                    도착요청시간 :&nbsp;
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={selectedTime}
                      onChange={handleTimeChanged}
                      className="col-start-1 row-start-1 w-[100px] appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      {times.map((time) => (
                        <option key={time} value={time} >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 sm:col-span-4">
                  <label htmlFor="houseSize" className="block text-sm/6 font-medium text-gray-900">
                    면적(평형)
                  </label>
                  <label htmlFor="startHouseSize" className="block text-sm/6 font-medium text-gray-900">
                    출발
                  </label>
                  <input
                    type="number"
                    value={s_house_size}
                    onChange={handleShouseSize}
                    className="block min-w-[200px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  ></input>

                  <label htmlFor="arriHouseSize" className="block text-sm/6 font-medium text-gray-900">
                    도착
                  </label>
                  <input
                    type="number"
                    value={a_house_size}
                    onChange={handleAhouseSize}
                    className="block min-w-[200px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  ></input>
                </div>
              </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
            <button 
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                견적요청서 수정
            </button>
        </div>        
      </div>
    </>
  )
}