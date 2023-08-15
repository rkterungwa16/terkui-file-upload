import { ReactNode, FC, useState } from "react";
import Image from "next/image";
import {
  FileUploadManager,
  FileUploadInput,
  FileUploadArea,
  FileUpload,
} from "../src";
import CircularProgressBar from "../src/circular-progress-bar";

const CLOUD_NAME = "doy0uyv63";
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
// https://api.cloudinary.com/v1_1/doy0uyv63

export default function Home() {
  const id = "file-upload";
  const name = "file-upload";
  return (
    <CompA>
      <CompB>
        <CompC>
          <FileUploadManager
            url={CLOUD_URL}
            method={"POST"}
            headers={{ "X-Requested-With": "XMLHttpRequest" }}
            inputComponent={<FileUploadInput id={id} name={name} />}
            uploadAreaComponent={
              <FileUploadArea
                style={{
                  width: "250px",
                  height: "250px",
                  border: "1px solid red",
                  display: "block",
                  color: "white",
                  padding: "1rem",
                }}
                htmlFor={name}
              >
                Upload area
              </FileUploadArea>
            }
          >
            {({ files, method, url, headers }) => {
              return (
                <>
                  {files.length
                    ? files.map((_file) => (
                        <FileUpload
                          key={_file.fileId}
                          method={method}
                          url={url}
                          headers={headers}
                          file={_file}
                        >
                          {({
                            requestState,
                            startUpload,
                            events,
                            progress,
                          }) => (
                            <>
                              {events?.upload_ready?.fileDataUrl && (
                                <>
                                  {console.log("events____", events)}
                                  {console.log("status____", requestState)}
                                  {console.log("progress____", progress)}

                                  <div
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Image
                                      src={events.upload_ready.fileDataUrl}
                                      alt={_file.name}
                                      width={150}
                                      height={150}
                                    />
                                    <button
                                      style={{
                                        position: "absolute",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bottom: "0px",
                                        right: "5px",
                                        height: "30px",
                                        width: "30px",
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "white",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        startUpload({
                                          file: _file,
                                          // fileDataUrl:
                                          //   events.upload_ready.fileDataUrl,
                                          upload_preset: "terunkom",
                                          api_key: "811718711578253",
                                          tags: "demo_upload",
                                        });
                                      }}
                                    >
                                      <Image
                                        alt="upload icon"
                                        src="/upload.png"
                                        width={24}
                                        height={24}
                                      />
                                    </button>
                                    <div
                                      style={{
                                        position: "absolute",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <CircularProgressBar
                                        width="45"
                                        height="48"
                                        viewBox="0 0 45 48"
                                        radius={16}
                                        firstArcEndAngle={
                                          progress.percent * 359.9
                                        }
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </FileUpload>
                      ))
                    : null}
                </>
              );
            }}
          </FileUploadManager>
        </CompC>
      </CompB>
    </CompA>
  );
}

const CompA: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );
};
const CompB: FC<{ children: ReactNode }> = ({ children }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter(counter + 1);
  };
  return (
    <div
      style={{
        border: "1px solid red",
        height: "250px",
        width: "250px",
        margin: "2rem auto",
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const CompC: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
