//새 견적서 요청
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "/lib/utils.js";

export default () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeTab, setActiveTab] = useState('car');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimeArea, setSelectedTimeArea] = useState('');
    const [times, setTimes] = useState([]);
    const timesArr = [];
    const [s_house_size, setShouseSize] = useState(0);
    const [a_house_size, setAhouseSize] = useState(0);
    const [appliances, setAppliances] = useState([]); //가전 체크된 목록

    useEffect( () => {
        for(let i = 0; i <= 23; i++){
            timesArr.push(`${i.toString().padStart(2, '0')}:00`);
        };

        setTimes(timesArr);
    }, []);

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

    const handleCheckboxChange = (isChecked) => {
        console.log(isChecked ? "Checked ID:" : "Unchecked ID:");
        if (isChecked) {
            return;
          } else {
            return;
          }
    }

    return (
        <>
        <div style={{float:'left'}}>
            <img src="https://dev.rz-codes.com/static/logo-275e932fd817cc84d99d91f7519a9a22.svg"
                width="50"
                height="50" 
                class="p-2"
                alt="Rz Codes Logo"
            />
            <div>
                <table>
                    <tbody>
                    <td rowSpan="2">경로</td>
                    <td>출발</td><td><input type="text" name="s_addr" /><button name="s_addr_find">주소찾기</button></td><tr />
                    <td /><td>도착</td><td><input type="text" name="a_addr" /><button name="a_addr_find">주소찾기</button></td>
                    </tbody>
                </table>
            </div>
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
        </div>
        <div style={{float:'right'}} >
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
            <div style={{marginTop:'20px'}} >
            {activeTab === 'car' ? (
                <div>
                    <p>물품선택</p>
                    <div>
                        <p>가전</p>
                        <p>
                        냉장고&nbsp; <input type="checkbox" value='냉장고' onChange={(e)=>toggleCheckboxAppli('냉장고', e.target.checked)}/>&nbsp;
                        김치냉장고&nbsp; <input type="checkbox" value='김치냉장고' onChange={(e)=>toggleCheckboxAppli('김치냉장고', e.target.checked)} />&nbsp;
                        세탁기&nbsp; <input type="checkbox" value='세탁기' onChange={(e)=>toggleCheckboxAppli('세탁기', e.target.checked)} />&nbsp;
                        건조기&nbsp; <input type="checkbox" value='건조기' onChange={(e)=>toggleCheckboxAppli('건조기', e.target.checked)} />&nbsp;
                        </p>
                        <p>
                        TV모니터&nbsp; <input type="checkbox" value='TV모니터' />&nbsp;
                        에어컨&nbsp; <input type="checkbox" value='에어컨' />&nbsp;
                        의류관리기&nbsp; <input type="checkbox" value='의류관리기' />&nbsp;
                        안마의자&nbsp; <input type="checkbox" value='안마의자' />&nbsp;
                        </p>
                        <p>
                        전자레인지&nbsp; <input type="checkbox" value='전자레인지' />&nbsp;
                        가스레인지&nbsp; <input type="checkbox" value='가스레인지' />&nbsp;
                        인덕션&nbsp; <input type="checkbox" value='인덕션' />&nbsp;
                        공기청정기&nbsp; <input type="checkbox" value='공기청정기' />&nbsp;
                        </p>
                        <p>
                        청소기&nbsp; <input type="checkbox" value='청소기' />&nbsp;
                        정수기&nbsp; <input type="checkbox" value='정수기' />&nbsp;
                        비데&nbsp; <input type="checkbox" value='비데' />&nbsp;
                        PC데스크탑&nbsp; <input type="checkbox" value='PC데스크탑' />&nbsp;
                        </p>

                        <p>선택된 가전 제품: {appliances.join(', ')}</p>
                    </div>
                    <div>
                        <p>가구</p>
                        <p>
                        침대메트리스&nbsp; <input type="checkbox" value='침대메트리스' />&nbsp;
                        침대프레임&nbsp; <input type="checkbox" value='침대프레임' />&nbsp;
                        책상&nbsp; <input type="checkbox" value='책상' />&nbsp;
                        의자&nbsp; <input type="checkbox" value='의자' />&nbsp;
                        </p>
                        <p>
                        소파&nbsp; <input type="checkbox" value='소파' />&nbsp;
                        테이블&nbsp; <input type="checkbox" value='테이블' />&nbsp;
                        수납장&nbsp; <input type="checkbox" value='수납장' />&nbsp;
                        서랍장&nbsp; <input type="checkbox" value='서랍장' />&nbsp;
                        </p>
                        <p>
                        책장&nbsp; <input type="checkbox" value='책장' />&nbsp;
                        옷장&nbsp; <input type="checkbox" value='옷장' />&nbsp;
                        화장대&nbsp; <input type="checkbox" value='화장대' />&nbsp;
                        행거&nbsp; <input type="checkbox" value='행거' />&nbsp;
                        </p>
                    </div>
                    <div>
                        <p>추가 내용 입력</p>
                        <textarea name="carContent"/>
                    </div>
                </div>
            ) : (
                <div>
                    <p>도우미 요청사항</p>
                    <div>
                        <p>짐 싸기/풀기 모두 원해요&nbsp;<input type="checkbox" value='모두' ></input></p>
                        <p>짐 풀기만 원해요&nbsp;<input type="checkbox" value='짐풀기' ></input></p>
                        <p>짐 싸기만 원해요&nbsp;<input type="checkbox" value='짐싸기' ></input></p>
                    </div>
                    <div>
                        <p>요청시간대 :&nbsp;
                            <input 
                                type="radio" 
                                value='오전' 
                                checked = {selectedTimeArea === '오전'} 
                                onChange = {handleTimeAreaChanged} />
                                &nbsp;오전&nbsp;
                          
                            <input 
                                type="radio" 
                                value='오후'
                                checked = {selectedTimeArea === '오후'} 
                                onChange = {handleTimeAreaChanged} />
                                &nbsp;오후&nbsp;
                           
                            <input 
                                type="radio" 
                                value='하루'
                                checked = {selectedTimeArea === '하루'} 
                                onChange = {handleTimeAreaChanged} />
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
                            출발 :&nbsp; <input type="text" value={s_house_size} onChange={handleShouseSize}></input>,&nbsp;
                            도착 :&nbsp; <input type="text" value={a_house_size} onChange={handleAhouseSize}></input> </p>
                    </div>
                </div>
            )}
            </div>
            <div>
                <button>견적요청서 제출</button>
            </div> 
        </div>  
             
        </>
    );
}