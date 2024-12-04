//새 견적서 요청
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Radio,
    RadioGroup,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import {
    Bars3Icon,
    CurrencyDollarIcon,
    GlobeAmericasIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'


import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css'
import "/lib/utils.js";

export default () => {
    const userId = Meteor.userId(); //현재 로그인한 사용자의 userId 조회
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [proposer, setProposer] = useState(''); //신청자
    const [sAddr, setSAddr] = useState(''); //출발지
    const [aAddr, setAAddr] = useState(''); //도착지
    const [addWorker, setAddWorker] = useState(false); //용달 추가인력
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
    const [sAddr_ladder, setSAddr_ladder] = useState(false); //출발지 사다리차 여부
    const [aAddr_ladder, setAAddr_ladder] = useState(false); //도착지 사다리차 여부
    const [isChecked, setIsChecked] = useState(false);
    const carTextareaRef = useRef();
    const [startHouseSize, setStartHouseSize] = useState(0); //출발지 집 평형

    //주소찾기
    const [startPostcode, setStartPostcode] = useState('');
    const [startAddress, setStartAddress] = useState('');
    const [detailStartAddress, setDetailStartAddress] = useState('');

    const [arrPostcode, setArrPostcode] = useState('');
    const [arrAddress, setArrAddress] = useState('');
    const [detailArrAddress, setDetailArrAddress] = useState('');

    //날짜
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

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

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    useEffect(() => {

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
                    setDetailStartAddress(''); // 상세 주소 초기화
                } else if (type === 'arr') {
                    setArrPostcode(data.zonecode); //우편번호
                    setArrAddress(addr); //주소
                    setDetailArrAddress(''); //상세 주소 초기화
                }
            }
        }).open();
    };


    //신청자
    const handleProposerChange = (e) => {
        setProposer(e.target.value);
    }

    //출발지
    const handleSAddrChange = (e) => {
        setSAddr(e.target.value);
    }

    //도착지
    const handleAAddrChange = (e) => {
        setAAddr(e.target.value);
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

    //사다리차 여부
    const handleLadderChange = (type) => {
        if (type === 'str') setSAddr_ladder((prev) => !prev);
        else if (type === 'arr') setAAddr_ladder((prev) => !prev);
    }

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

    //출발지 집 평형
    const handleStartHouseSize = (e) => {
        setStartHouseSize(e.target.value);
    }

    //날짜 검증
    const handleDateChange = (date) => {
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

    //입력 체크
    const checkInputData = () => {
        if (
            proposer === '' ||
            startAddress === '' ||
            detailStartAddress === '' ||
            arrAddress === '' ||
            detailArrAddress === '' ||
            selectedDate === null ||
            startHouseSize === 0 ||
            carSelectedTime === '' ||
            (appliances.length === 0 &&
                furnitures.length === 0 &&
                carContent === '')
        ) {
            alert("필수 입력사항이 누락되었습니다! 입력해 주세요.");
            return false;
        }

    }

    //견적서 제출
    const handleSubmit = () => {
        const checked = checkInputData(); //필수 입력사항 체크

        if (checked !== false) {
            const isconfirm = window.confirm("견적 요청서를 제출하시겠습니까?");

            if (isconfirm) {
                const jsonRequestData = {
                    user_id: userId,
                    user_name: proposer,
                    move_date: selectedDate,
                    start_address: startAddress + ' ' + detailStartAddress,
                    arrive_address: arrAddress + ' ' + detailArrAddress,
                    house_size: startHouseSize,
                    addworker: addWorker,
                    reqCar: {
                        req_arr_time: carSelectedTime,
                        str_addr_elv: sAddrEv,
                        arr_addr_elv: aAddrEv,
                        ladder_truck: {
                            start: sAddr_ladder,
                            arrive: aAddr_ladder
                        },
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

                //db insert
                Meteor.call('insertRequest', jsonRequestData, (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log("insert success!!");
                    alert("견적 요청서가 저장되었습니다.");

                    //리스트 화면으로 돌아가기
                    navigate('/mypage/checkrequest');
                })
            } else {
                console.log("취소");
                return;
            }
        }
    }


    return (
        <>
            <div style={{ float: 'left' }}>
                <img src="https://dev.rz-codes.com/static/logo-275e932fd817cc84d99d91f7519a9a22.svg"
                    width="50"
                    height="50"
                    class="p-2"
                    alt="Rz Codes Logo"
                />
                <p className="relative pl-6">
                    <span className="absolute left-0 top-0 text-red-500">*</span>신청자 :&nbsp;</p>
                <input type="text" value={proposer} onChange={handleProposerChange} />
                <div>
                    <p className="relative pl-6">
                        <span className="absolute left-0 top-0 text-red-500">*</span>출발지 : &nbsp;</p>
                    <input
                        type="text"
                        value={startPostcode}
                        placeholder="우편번호"
                        readOnly
                    />
                    <input
                        type="button"
                        value="우편번호 찾기"
                        onClick={() => handlePostcodeSearch('start')}
                    /><br />

                    <input
                        type="text"
                        value={startAddress}
                        placeholder="주소"
                        readOnly
                    /><br />

                    <input
                        type="text"
                        value={detailStartAddress}
                        placeholder="상세주소"
                        onChange={(e) => setDetailStartAddress(e.target.value)}
                    />
                    <br />
                    <p className="relative pl-6">
                        <span className="absolute left-0 top-0 text-red-500">*</span>도착지 : &nbsp;</p>
                    <input
                        type="text"
                        value={arrPostcode}
                        placeholder="우편번호"
                        readOnly
                    />
                    <input
                        type="button"
                        value="우편번호 찾기"
                        onClick={() => handlePostcodeSearch('arr')}
                    /><br />

                    <input
                        type="text"
                        value={arrAddress}
                        placeholder="주소"
                        readOnly
                    /><br />

                    <input
                        type="text"
                        value={detailArrAddress}
                        placeholder="상세주소"
                        onChange={(e) => setDetailArrAddress(e.target.value)}
                    />
                </div>
                <div>
                    <p className="relative pl-6">
                        <span className="absolute left-0 top-0 text-red-500">*</span>날짜 : &nbsp;
                        <DatePicker
                            selected={selectedDate}
                            // onChange={(date) => setSelectedDate(date)}
                            onChange={handleDateChange} //날짜 검증
                            dateFormat="yyyy.MM.dd" // 원하는 날짜 형식 설정
                            isClearable // 선택 해제 버튼 추가
                            placeholderText="&#128198; 0000.00.00"
                        />

                    </p>
                </div>
                <p className="relative pl-6">
                    <span className="absolute left-0 top-0 text-red-500">*</span>출발지 평형(전용 면적) :&nbsp;</p>
                <input type="number" value={startHouseSize} onChange={handleStartHouseSize} />
                용달 인부 추가 여부&nbsp;
                <input type="checkbox" name="addWorker" onChange={() => handleAddworkerChange(isChecked)} />
            </div>
            <div style={{ float: 'right' }} >
                <p className="relative pl-6">
                    <span className="absolute left-0 top-0 text-red-500">*</span><h2>이사물품 입력</h2>
                </p>
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
                                <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
                                    <legend className="font-bold text-lg mb-2">가전 제품</legend>
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                                        {items.appliances.map((apll) => (
                                            <label for={apll.index} className="mb-2">
                                                <input type="checkbox"
                                                    className={classNames(
                                                        'cursor-pointer focus:outline-none', // 기본 상태 스타일
                                                        'peer hidden', // 체크박스 숨기기, peer 클래스를 통해 label과 연결
                                                        'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50'
                                                    )}
                                                    id={apll.index} value={apll.name} onChange={(e) => toggleCheckboxAppli(apll.name, e.target.checked)} style={{ display: 'none' }} />
                                                <span
                                                    className={classNames(
                                                        'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50', // 기본 스타일
                                                        'peer-checked:border-transparent peer-checked:bg-gray-400 peer-checked:text-white', // 체크된 상태에서 스타일 변경
                                                        'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2' // 포커스 스타일
                                                    )}
                                                >{apll.name}</span>
                                            </label>
                                        ))}

                                        {/* 
                                        <label for="b" className="mb-2">김치냉장고&nbsp; <input type="checkbox" id="b" value='김치냉장고' onChange={(e) => toggleCheckboxAppli('김치냉장고', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="c" className="mb-2">세탁기&nbsp; <input type="checkbox" id="c" value='세탁기' onChange={(e) => toggleCheckboxAppli('세탁기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="d" className="mb-2">건조기&nbsp; <input type="checkbox" id="d" value='건조기' onChange={(e) => toggleCheckboxAppli('건조기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;

                                        <label for="e" className="mb-2">TV모니터&nbsp; <input type="checkbox" id="e" value='TV모니터' onChange={(e) => toggleCheckboxAppli('TV모니터', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="f" className="mb-2">에어컨&nbsp; <input type="checkbox" id="f" value='에어컨' onChange={(e) => toggleCheckboxAppli('에어컨', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="g" className="mb-2">의류관리기&nbsp; <input type="checkbox" id="g" value='의류관리기' onChange={(e) => toggleCheckboxAppli('의류관리기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="h" className="mb-2">안마의자&nbsp; <input type="checkbox" id="h" value='안마의자' onChange={(e) => toggleCheckboxAppli('안마의자', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;

                                        <label for="i" className="mb-2">전자레인지&nbsp; <input type="checkbox" id="i" value='전자레인지' onChange={(e) => toggleCheckboxAppli('전자레인지', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="j" className="mb-2">가스레인지&nbsp; <input type="checkbox" id="j" value='가스레인지' onChange={(e) => toggleCheckboxAppli('가스레인지', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="k" className="mb-2">인덕션&nbsp; <input type="checkbox" id="k" value='인덕션' onChange={(e) => toggleCheckboxAppli('인덕션', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="l" className="mb-2">공기청정기&nbsp; <input type="checkbox" id="l" value='공기청정기' onChange={(e) => toggleCheckboxAppli('공기청정기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;

                                        <label for="m" className="mb-2">청소기&nbsp; <input type="checkbox" id="m" value='청소기' onChange={(e) => toggleCheckboxAppli('청소기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="n" className="mb-2">정수기&nbsp; <input type="checkbox" id="n" value='정수기' onChange={(e) => toggleCheckboxAppli('정수기', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="o" className="mb-2">비데&nbsp; <input type="checkbox" id="o" value='비데' onChange={(e) => toggleCheckboxAppli('비데', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                        <label for="p" className="mb-2">PC데스크탑&nbsp; <input type="checkbox" id="p" value='PC데스크탑' onChange={(e) => toggleCheckboxAppli('PC데스크탑', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp; */}
                                    </div>
                                </fieldset>
                                {/* <p>선택된 가전 제품: {appliances.join(', ')}</p> */}
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
                                                    id={furniture.index} value={furniture.name} onChange={(e) => toggleCheckboxFurni(furniture.name, e.target.checked)} style={{ display: 'none' }} />
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
                                {/* <label for="q">침대메트리스&nbsp; <input type="checkbox" id="q" value='침대메트리스' onChange={(e) => toggleCheckboxFurni('침대메트리스', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="r">침대프레임&nbsp; <input type="checkbox" id="r" value='침대프레임' onChange={(e) => toggleCheckboxFurni('침대프레임', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="s">책상&nbsp; <input type="checkbox" id="s" value='책상' onChange={(e) => toggleCheckboxFurni('책상', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="t">의자&nbsp; <input type="checkbox" id="t" value='의자' onChange={(e) => toggleCheckboxFurni('의자', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;

                                <label for="u">소파&nbsp; <input type="checkbox" id="u" value='소파' onChange={(e) => toggleCheckboxFurni('소파', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="v">테이블&nbsp; <input type="checkbox" id="v" value='테이블' onChange={(e) => toggleCheckboxFurni('테이블', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="w">수납장&nbsp; <input type="checkbox" id="w" value='수납장' onChange={(e) => toggleCheckboxFurni('수납장', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="x">서랍장&nbsp; <input type="checkbox" id="x" value='서랍장' onChange={(e) => toggleCheckboxFurni('서랍장', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;

                                <label for="y">책장&nbsp; <input type="checkbox" id="y" value='책장' onChange={(e) => toggleCheckboxFurni('책장', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="z">옷장&nbsp; <input type="checkbox" id="z" value='옷장' onChange={(e) => toggleCheckboxFurni('옷장', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="aa">화장대&nbsp; <input type="checkbox" id="aa" value='화장대' onChange={(e) => toggleCheckboxFurni('화장대', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
                                <label for="bb">행거&nbsp; <input type="checkbox" id="bb" value='행거' onChange={(e) => toggleCheckboxFurni('행거', e.target.checked)} style={{ display: 'none' }} /></label>&nbsp;
*/}
                                {/* <p>선택된 가구 목록: {furnitures.join(', ')}</p> */}
                            </div>
                            <div>
                                <p className="relative pl-6">
                                    <span className="absolute left-0 top-0 text-red-500">*</span>
                                    도착요청시간 :&nbsp;</p>
                                <select value={carSelectedTime} onChange={handleCarTimeChanged}>
                                    {times.map((time) => (
                                        <option key={time} value={time} >
                                            {time}
                                        </option>
                                    ))}
                                </select>

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
                                <p>
                                    사다리차 필요 여부 :
                                    출발지 - 필요&nbsp;
                                    <input
                                        type="radio"
                                        name="sAddr_ladder"
                                        value={true}
                                        checked={sAddr_ladder === true}
                                        onChange={() => handleLadderChange('str')}
                                    ></input>&nbsp;
                                    불필요&nbsp;
                                    <input
                                        type="radio"
                                        name="sAddr_ladder"
                                        value={false}
                                        checked={sAddr_ladder === false}
                                        onChange={() => handleLadderChange('str')}
                                    ></input>&nbsp;
                                    도착지 - 필요&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddr_ladder"
                                        value={true}
                                        checked={aAddr_ladder === true}
                                        onChange={() => handleLadderChange('arr')}
                                    ></input>&nbsp;
                                    불필요&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddr_ladder"
                                        value={false}
                                        checked={aAddr_ladder === false}
                                        onChange={() => handleLadderChange('arr')}
                                    ></input>&nbsp;
                                </p>
                            </div>
                            <div>
                                <p>추가 내용 입력</p>
                                <p>2개 이상인 물품은 반드시 입력해 주세요!!</p>
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
                                <p>면적(평형) :&nbsp;
                                    출발 :&nbsp; <input type="number" value={s_house_size} onChange={handleShouseSize}></input>,&nbsp;
                                    도착 :&nbsp; <input type="number" value={a_house_size} onChange={handleAhouseSize}></input> </p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <button onClick={handleSubmit}>견적요청서 제출</button>
                </div>
            </div>

        </>
    );
}