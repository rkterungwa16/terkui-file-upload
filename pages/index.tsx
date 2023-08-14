import { ReactNode, FC, useState } from "react";
import Image from "next/image";
import {
  FileUploadManager,
  FileUploadInput,
  FileUploadArea,
  FileUpload,
} from "../src";

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
                          {({ requestState, startUpload, events, progress }) => (
                            <>
                              {events?.upload_ready?.fileDataUrl && (
                                <>
                                  {console.log('events____', events)}
                                  {console.log('status____', requestState)}
                                  {console.log('progress____', progress)}

                                  <Image
                                    src={events.upload_ready.fileDataUrl}
                                    alt={_file.name}
                                    width={150}
                                    height={150}
                                  />
                                  <button
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
                                    upload
                                  </button>
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
