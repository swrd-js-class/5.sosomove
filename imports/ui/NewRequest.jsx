//새 견적서 요청
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "/lib/utils.js";

export default () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [proposer, setProposer] = useState(''); //신청자
    const [sAddr, setSAddr] = useState(''); //출발지
    const [aAddr, setAAddr] = useState(''); //도착지
    const [addWorker, setAddWorker] = useState(false); //용달 추가인력
    const [activeTab, setActiveTab] = useState('car');
    const [selectedTime, setSelectedTime] = useState('');
    const [sAddrEv, setSAddrEv] = useState(false); //출발지-엘레베이터 여부
    const [aAddrEv, setAAddrEv] = useState(false); //도착지-엘레베이터 여부
    const [times, setTimes] = useState([]);
    const timesArr = [];
    const [appliances, setAppliances] = useState([]); //가전 체크된 목록
    const [furnitures, setFurnitures] = useState([]); //가전 체크된 목록
    const [carContent, setCarContent] = useState(''); //상세내역
    const [selectedTimeArea, setSelectedTimeArea] = useState(''); //오전/오후/하루 옵션
    const [selHelpOption, setSelHelpOption] = useState(''); //모두,짐싸기,짐풀기 옵션
    const [s_house_size, setShouseSize] = useState(0);
    const [a_house_size, setAhouseSize] = useState(0);
    const [sAddr_ladder, setSAddr_ladder] = useState(false); //출발지 사다리차 여부
    const [aAddr_ladder, setAAddr_ladder] = useState(false); //출발지 사다리차 여부
    const [isChecked, setIsChecked] = useState(false);

    const userId = Meteor.userId(); //현재 로그인한 사용자의 userId 조회

    //주소찾기
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [extraAddress, setExtraAddress] = useState('');

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
    const handlePostcodeSearch = () => {
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

                // 도로명 주소일 때 추가적인 참고 항목을 생성
                if (data.userSelectedType === 'R') {
                    if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }

                    if (data.buildingName && data.apartment === 'Y') {
                        extraAddr += extraAddr ? `, ${data.buildingName}` : data.buildingName;
                    }

                    if (extraAddr) {
                        extraAddr = ` (${extraAddr})`;
                    }
                    setExtraAddress(extraAddr);
                } else {
                    setExtraAddress('');
                }

                setPostcode(data.zonecode); // 우편번호
                setAddress(addr); // 주소
                setDetailAddress(''); // 상세 주소 초기화
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

    //시간 변경 시
    const handleTimeChanged = (e) => {
        setSelectedTime(e.target.value);
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
    const handleCarContentChange = (e) => {
        setCarContent(e.target.value);
    }

    //짐싸기, 짐풀기, 모두 옵션 선택
    const handleHelpOptionChange = (e) => {
        setSelHelpOption(e.target.value);
    }

    //사다리차 여부
    const handleLadderChange = (e, type) => {
        if (type === 'str') setSAddr_ladder(e.target.value);
        else if (type === 'arr') setAAddr_ladder(e.target.value);
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
    const handleEvChange = (e, type) => {
        if (type === 'str') setSAddrEv(e.target.value);
        else if (type === 'arr') setAAddrEv(e.target.value);
    }


    //견적서 제출
    const handleSubmit = () => {
        const jsonRequestData = {
            user_id: userId,
            user_name: proposer,
            move_date: selectedDate,
            start_address: sAddr,
            arrive_address: aAddr,
            house_size: s_house_size,
            addworker: addWorker,
            reqCar: {
                req_arr_time: selectedTime,
                str_addr_elv: sAddrEv,
                arr_addr_elv: aAddrEv,
                ladder_truck: {
                    start: sAddr_ladder,
                    arrive: aAddr_ladder
                },
                appliances: appliances,
                funiture: furnitures,
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
        })
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
                신청자 :&nbsp;
                <input type="text" value={proposer} onChange={handleProposerChange} />
                <div>
                    출발지 : &nbsp;
                    <input
                        type="text"
                        value={postcode}
                        placeholder="우편번호"
                        readOnly
                    />
                    <input
                        type="button"
                        value="우편번호 찾기"
                        onClick={handlePostcodeSearch}
                    /><br />

                    <input
                        type="text"
                        value={address}
                        placeholder="주소"
                        readOnly
                    /><br />

                    <input
                        type="text"
                        value={detailAddress}
                        placeholder="상세주소"
                        onChange={(e) => setDetailAddress(e.target.value)}
                    />

                    <input
                        type="text"
                        value={extraAddress}
                        placeholder="참고항목"
                        readOnly
                    />
                </div>
                {/* <div>
                    <table>
                        <tbody>
                            <td rowSpan="2">경로</td>
                            <td>출발</td><td><input type="text" name="s_addr" value={sAddr} onChange={(e) => setSAddr(e.target.value)} /><button name="s_addr_find" >주소찾기</button></td><tr />
                            <td /><td>도착</td><td><input type="text" name="a_addr" value={aAddr} onChange={handleAAddrChange} /><button name="a_addr_find">주소찾기</button></td>
                        </tbody>
                    </table>
                </div> */}
                <div>
                    날짜 :
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd" // 원하는 날짜 형식 설정
                        isClearable // 선택 해제 버튼 추가
                        placeholderText="날짜를 선택하세요"
                    />
                </div>
                용달 인부 추가 여부&nbsp;
                <input type="checkbox" name="addWorker" checked={isChecked} onChange={() => handleAddworkerChange(isChecked)} />
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
                                <p>
                                    냉장고&nbsp; <input type="checkbox" value='냉장고' onChange={(e) => toggleCheckboxAppli('냉장고', e.target.checked)} />&nbsp;
                                    김치냉장고&nbsp; <input type="checkbox" value='김치냉장고' onChange={(e) => toggleCheckboxAppli('김치냉장고', e.target.checked)} />&nbsp;
                                    세탁기&nbsp; <input type="checkbox" value='세탁기' onChange={(e) => toggleCheckboxAppli('세탁기', e.target.checked)} />&nbsp;
                                    건조기&nbsp; <input type="checkbox" value='건조기' onChange={(e) => toggleCheckboxAppli('건조기', e.target.checked)} />&nbsp;
                                </p>
                                <p>
                                    TV모니터&nbsp; <input type="checkbox" value='TV모니터' onChange={(e) => toggleCheckboxAppli('TV모니터', e.target.checked)} />&nbsp;
                                    에어컨&nbsp; <input type="checkbox" value='에어컨' onChange={(e) => toggleCheckboxAppli('에어컨', e.target.checked)} />&nbsp;
                                    의류관리기&nbsp; <input type="checkbox" value='의류관리기' onChange={(e) => toggleCheckboxAppli('의류관리기', e.target.checked)} />&nbsp;
                                    안마의자&nbsp; <input type="checkbox" value='안마의자' onChange={(e) => toggleCheckboxAppli('안마의자', e.target.checked)} />&nbsp;
                                </p>
                                <p>
                                    전자레인지&nbsp; <input type="checkbox" value='전자레인지' onChange={(e) => toggleCheckboxAppli('전자레인지', e.target.checked)} />&nbsp;
                                    가스레인지&nbsp; <input type="checkbox" value='가스레인지' onChange={(e) => toggleCheckboxAppli('가스레인지', e.target.checked)} />&nbsp;
                                    인덕션&nbsp; <input type="checkbox" value='인덕션' onChange={(e) => toggleCheckboxAppli('인덕션', e.target.checked)} />&nbsp;
                                    공기청정기&nbsp; <input type="checkbox" value='공기청정기' onChange={(e) => toggleCheckboxAppli('공기청정기', e.target.checked)} />&nbsp;
                                </p>
                                <p>
                                    청소기&nbsp; <input type="checkbox" value='청소기' onChange={(e) => toggleCheckboxAppli('청소기', e.target.checked)} />&nbsp;
                                    정수기&nbsp; <input type="checkbox" value='정수기' onChange={(e) => toggleCheckboxAppli('정수기', e.target.checked)} />&nbsp;
                                    비데&nbsp; <input type="checkbox" value='비데' onChange={(e) => toggleCheckboxAppli('비데', e.target.checked)} />&nbsp;
                                    PC데스크탑&nbsp; <input type="checkbox" value='PC데스크탑' onChange={(e) => toggleCheckboxAppli('PC데스크탑', e.target.checked)} />&nbsp;
                                </p>

                                <p>선택된 가전 제품: {appliances.join(', ')}</p>
                            </div>
                            <div>
                                <p>가구</p>
                                <p>
                                    침대메트리스&nbsp; <input type="checkbox" value='침대메트리스' onChange={(e) => toggleCheckboxFurni('침대메트리스', e.target.checked)} />&nbsp;
                                    침대프레임&nbsp; <input type="checkbox" value='침대프레임' onChange={(e) => toggleCheckboxFurni('침대프레임', e.target.checked)} />&nbsp;
                                    책상&nbsp; <input type="checkbox" value='책상' onChange={(e) => toggleCheckboxFurni('책상', e.target.checked)} />&nbsp;
                                    의자&nbsp; <input type="checkbox" value='의자' onChange={(e) => toggleCheckboxFurni('의자', e.target.checked)} />&nbsp;
                                </p>
                                <p>
                                    소파&nbsp; <input type="checkbox" value='소파' onChange={(e) => toggleCheckboxFurni('소파', e.target.checked)} />&nbsp;
                                    테이블&nbsp; <input type="checkbox" value='테이블' onChange={(e) => toggleCheckboxFurni('테이블', e.target.checked)} />&nbsp;
                                    수납장&nbsp; <input type="checkbox" value='수납장' onChange={(e) => toggleCheckboxFurni('수납장', e.target.checked)} />&nbsp;
                                    서랍장&nbsp; <input type="checkbox" value='서랍장' onChange={(e) => toggleCheckboxFurni('서랍장', e.target.checked)} />&nbsp;
                                </p>
                                <p>
                                    책장&nbsp; <input type="checkbox" value='책장' onChange={(e) => toggleCheckboxFurni('책장', e.target.checked)} />&nbsp;
                                    옷장&nbsp; <input type="checkbox" value='옷장' onChange={(e) => toggleCheckboxFurni('옷장', e.target.checked)} />&nbsp;
                                    화장대&nbsp; <input type="checkbox" value='화장대' onChange={(e) => toggleCheckboxFurni('화장대', e.target.checked)} />&nbsp;
                                    행거&nbsp; <input type="checkbox" value='행거' onChange={(e) => toggleCheckboxFurni('행거', e.target.checked)} />&nbsp;
                                </p>
                                <p>선택된 가구 목록: {furnitures.join(', ')}</p>
                            </div>
                            <div>
                                <p>
                                    출발지-e/v : 있음&nbsp;
                                    <input
                                        type="radio"
                                        name="sAddrEv"
                                        value={true}
                                        checked={sAddrEv === isChecked}
                                        onChange={() => handleEvChange('str')}
                                    ></input>&nbsp;
                                    없음&nbsp;
                                    <input
                                        type="radio"
                                        name="sAddrEv"
                                        value={false}
                                        checked={sAddrEv === isChecked}
                                        onChange={() => handleEvChange('str')}
                                    ></input>&nbsp;
                                </p>
                                <p>
                                    도착지-e/v : 있음&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddrEv"
                                        value={true}
                                        checked={aAddrEv === isChecked}
                                        onChange={() => handleEvChange('arr')}
                                    ></input>&nbsp;
                                    없음&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddrEv"
                                        value={false}
                                        checked={aAddrEv === isChecked}
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
                                        checked={sAddr_ladder === isChecked}
                                        onChange={() => handleLadderChange('str')}
                                    ></input>&nbsp;
                                    불필요&nbsp;
                                    <input
                                        type="radio"
                                        name="sAddr_ladder"
                                        value={false}
                                        checked={sAddr_ladder === isChecked}
                                        onChange={() => handleLadderChange('str')}
                                    ></input>&nbsp;
                                    도착지 - 필요&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddr_ladder"
                                        value={true}
                                        checked={aAddr_ladder === isChecked}
                                        onChange={() => handleLadderChange('arr')}
                                    ></input>&nbsp;
                                    불필요&nbsp;
                                    <input
                                        type="radio"
                                        name="aAddr_ladder"
                                        value={false}
                                        checked={aAddr_ladder === isChecked}
                                        onChange={() => handleLadderChange('arr')}
                                    ></input>&nbsp;
                                </p>
                            </div>
                            <div>
                                <p>추가 내용 입력</p>
                                <textarea
                                    name="carContent"
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
                                        type="radio"
                                        value='오전'
                                        checked={selectedTimeArea === '오전'}
                                        onChange={handleTimeAreaChanged} />
                                    &nbsp;오전&nbsp;

                                    <input
                                        type="radio"
                                        value='오후'
                                        checked={selectedTimeArea === '오후'}
                                        onChange={handleTimeAreaChanged} />
                                    &nbsp;오후&nbsp;

                                    <input
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
                                    출발 :&nbsp; <input type="text" pattern="\d+" title="숫자만 입력 가능합니다." value={s_house_size} onChange={handleShouseSize}></input>,&nbsp;
                                    도착 :&nbsp; <input type="text" pattern="\d+" title="숫자만 입력 가능합니다." value={a_house_size} onChange={handleAhouseSize}></input> </p>
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