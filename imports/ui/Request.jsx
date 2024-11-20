import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { Files } from "/imports/api/Files.js";

//테스트용
export default () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectedFile(file);
      console.log(file);
    }
  };
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
        alert(`Error during upload: ${error}`);
      } else {
        alert(`File "${fileObj.name}" successfully uploaded`);
      }
    });
    upload.start();
  };
  //파일 조회
  const files = useTracker(() => {
    const subscription = Meteor.subscribe('files');
    if (!subscription.ready()) {
      return '로딩 중';
    }
    return Files.find().fetch();
  });

  console.log(files);



  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleFileUpload}>업로드</button>
      <h4>Uploaded Files:</h4>
      <div>
        {Files.find()
          .fetch()
          .map((file) => {
            const fileUrl = `http://localhost:3000/cfs/hoho/files/${file._id}/${file.name}`;
            return (
              <div key={file._id}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  {file.name}/{fileUrl}
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
};