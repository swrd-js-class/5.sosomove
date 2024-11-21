import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { Files } from "/imports/api/Files.js";
import { BusinessFiles } from "/imports/api/collections";

//파일 올리기 테스트용
export default () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLink, setFileLink] = useState('');

  const handleFileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectedFile(file);
    }
  };

  const userId = Meteor.userId();
  console.log(userId);


  //파일 업로드
  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("No file selected for upload.");
      return;
    }
    const upload = Files.insert(
      {
        file: selectedFile,
        chunkSize: "dynamic",
      },
      false
    );
    upload.on("start", function () {
      console.log("Upload started...");
    });
    upload.on("end", function (error, fileObj) {
      if (error) {
        alert(`업로드 중 에러: ${error}`);
      } else {
        alert(`파일 "${fileObj.name}" 업로드 성공`);

        Meteor.call('getFileLink', fileObj._id, (err, link) => {
          if (err) {
            alert('파일 링크를 가져오는 데 실패했습니다: ' + err.message);
          } else {
            setFileLink(link);
          }
        });
      }
    });
    upload.start();
  };

  const files = useTracker(() => {
    Meteor.subscribe('files');
    return Files.find({ userId }).fetch();
  });
  console.log(files);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>업로드</button>
      <h4>업로드된 파일:</h4>
      <div>
        {files.map((file) => {
          return (
            <div key={file._id}>
              {file.name}/
              <button
                onClick={() => {
                  Meteor.call('getFileLink', file._id, (err, link) => {
                    if (err) {
                      alert('파일 링크를 가져오는 데 실패했습니다: ' + err.message);
                    } else {
                      window.open(link, '_blank');
                    }
                  });
                }}
              >
                이미지 확인
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};