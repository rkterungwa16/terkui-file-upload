import { ReactNode, FC, useState } from "react";
import {
  FileManager,
  FileUploadManager,
  FileUploadInput,
  FileUploadArea,
} from "../src";

export default function Home() {
  const id = "file-upload";
  const name = "file-upload";
  return (
    <CompA>
      <CompB>
        <CompC>
          <FileManager number={1}>
            <div>My Name</div>
          </FileManager>
          <FileManager number={2}>
            <div>My Titles</div>
          </FileManager>
          <FileUploadManager
            inputComponent={<FileUploadInput id={id} name={name} />}
            uploadAreaComponent={
              <FileUploadArea
                style={{
                  width: "200px",
                  height: "200px",
                  border: "1px solid black",
                  display: "block",
                }}
                htmlFor={name}
              >
                Upload area
              </FileUploadArea>
            }
          >
            {(files) => {
              console.log("files -->>", files);
              return <></>;
            }}
          </FileUploadManager>
        </CompC>
      </CompB>
    </CompA>
  );
}

const CompA: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
const CompB: FC<{ children: ReactNode }> = ({ children }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter(counter + 1);
  };
  return (
    <div style={{ border: "1px solid red" }} onClick={handleClick}>
      {children}
    </div>
  );
};

const CompC: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
