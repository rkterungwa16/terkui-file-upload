import { ReactNode, FC, useState } from "react";
import Image from "next/image";
import {
  FileUploadManager,
  FileUploadInput,
  FileUploadArea,
  FileUpload,
} from "../src";
import CircularProgressBar from "../src/circular-progress-bar";
import { Layout } from "../src/layout";

import styles from "../src/styles.module.css";
import { UploadIcon } from "../src/icons/upload-icon";

const CLOUD_NAME = "doy0uyv63";
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
// https://api.cloudinary.com/v1_1/doy0uyv63

export default function Home() {
  const id = "file-upload";
  const name = "file-upload";
  return (
    <Layout>
      <div className={styles.StyledCard}>
        <div className={styles.CardHeader}>
          <div className={styles.CardHeaderIconWrapper}>
            <UploadIcon />
          </div>
          <div className={styles.CardHeaderTextWrapper}>
            <h5 className={styles.Text__h5}>Upload files</h5>
            <h6 className={styles.Text__h6}>
              Select and upload the files of your choice
            </h6>
          </div>
        </div>
        <div className={styles.CardBody}>
          <FileUploadManager
            url={CLOUD_URL}
            method={"POST"}
            headers={{ "X-Requested-With": "XMLHttpRequest" }}
            inputComponent={<FileUploadInput id={id} name={name} />}
            uploadAreaComponent={
              <FileUploadArea
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  height: "250px",
                  border: "1px dashed #CBD0DC",
                  padding: "1rem",
                  background: "#ffffff",
                  borderRadius: "1rem",
                }}
              >
                <h4 style={{ paddingTop: "1rem", paddingBottom: "0.5rem" }}>
                  <b>Drag and Drop files here</b>
                </h4>
                <p style={{ paddingTop: "0.5rem", paddingBottom: "1rem" }}>
                  OR
                </p>

                <label
                  className={`${styles.StyledPrimaryButton} ${styles.Button}`}
                  role="button"
                  htmlFor={name}
                >
                  upload
                </label>
              </FileUploadArea>
            }
          >
            {({ files, method, url, headers }) => {
              if (files.length) {
                return (
                  <div
                    style={{
                      background: "#f3f1f2",
                      width: "100%",
                      marginTop: "1rem",
                      padding: "0.6rem",
                      borderRadius: "1rem",
                    }}
                  >
                    {files.map((_file) => (
                      <FileUpload
                        key={_file.fileId}
                        method={method}
                        url={url}
                        headers={headers}
                        file={_file}
                        auto
                      >
                        {({ requestState, startUpload, events, progress }) => (
                          <>
                            {events?.upload_ready?.fileDataUrl && (
                              <>
                                {/* {console.log("events____", events)}
                                  {console.log("status____", requestState)}
                                  {console.log("progress____", progress)} */}

                                <div
                                  className={styles.StyledCard}
                                  style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <Image
                                    src={events.upload_ready.fileDataUrl}
                                    alt={_file.name}
                                    width={50}
                                    height={50}
                                    style={{
                                      borderRadius: "6px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      marginLeft: "0.5rem",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {_file.name}
                                    </span>
                                    {requestState &&
                                      events[requestState] &&
                                      progress.percent !== 1 && (
                                        <span
                                          style={{
                                            fontSize: "14px",
                                            color: "#a4aeb6",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {events.upload_progress.timeRemaining}{" "}
                                          s
                                        </span>
                                      )}
                                  </div>
                                  {/* <button
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
                                  </button> */}

                                  {requestState &&
                                    events[requestState] &&
                                    progress.percent !== 1 && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          right: "0.5rem",
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
                                    )}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </FileUpload>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          </FileUploadManager>
        </div>
      </div>
    </Layout>
  );
}
