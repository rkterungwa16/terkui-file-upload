import { nanoid } from "nanoid";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { UploadFile } from "./types";
import {
  FileUploadStatus,
  FileErrorStatus,
  FileDownloadStatus,
} from "./constants";
import { configXhr, useReadFileDataAsUrl } from "./helpers";

export const modifySelectedFiles = (selectedFiles: FileList): UploadFile[] => {
  return Array.from(selectedFiles).map((file) => {
    return Object.assign(file, { fileId: nanoid() });
  });
};

type RequestProps = {
  method: string;
  url: string;
  headers: { [x: string]: any };

  // form data
  formData?: FormData;
  file: UploadFile;

  children: (data: any) => ReactNode;
};

export const FileUpload = (requestProps: RequestProps) => {
  const { method, url, headers, file, children } = requestProps;
  const xhr = configXhr({
    method,
    url,
    headers,
  });
  const { fileDataUrl } = useReadFileDataAsUrl(file);
  const [progress, setProgress] = useState({
    fileId: file.fileId,
    point: 0,
  });
  const [requestState, setRequestState] = useState<
    FileUploadStatus | null | FileErrorStatus | FileDownloadStatus
  >(null);
  // For each event set it as the current request state.
  //
  // const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [eventDetails, setEventDetails] = useState({
    [FileUploadStatus.UPLOAD_READY]: {
      fileDataUrl,
    },
    [FileUploadStatus.UPLOAD_PROGRESS]: {
      progress: 0,
      fileId: file.fileId,
    },
  });

  const setEvent = useCallback(
    (status: FileUploadStatus | FileErrorStatus | FileDownloadStatus) => {
      return (e: ProgressEvent<XMLHttpRequestEventTarget | FileReader>) => {
        setRequestState(status);
        setEventDetails({
          ...eventDetails,
          [status]: e,
        });
      };
    },
    [eventDetails]
  );

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = setEvent(FileUploadStatus.UPLOAD_READY);
      reader.readAsDataURL(file);
    }
  }, [file, setEvent]);

  useEffect(() => {
    xhr.upload.addEventListener(
      "loadstart",
      setEvent(FileUploadStatus.UPLOAD_START)
    );
    xhr.upload.addEventListener(
      "progress",
      setEvent(FileUploadStatus.UPLOAD_PROGRESS)
    );
    xhr.upload.addEventListener(
      "loadend",
      setEvent(FileUploadStatus.UPLOAD_COMPLETE)
    );
    xhr.addEventListener("error", setEvent(FileErrorStatus.ERROR));
    xhr.addEventListener("abort", setEvent(FileErrorStatus.ABORT));
    xhr.addEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
    // xhr.onreadystatechange = onReadyStateChange;
    return () => {
      xhr.upload.removeEventListener(
        "loadstart",
        setEvent(FileUploadStatus.UPLOAD_START)
      );
      xhr.upload.removeEventListener(
        "progress",
        setEvent(FileUploadStatus.UPLOAD_PROGRESS)
      );
      xhr.upload.removeEventListener(
        "loadend",
        setEvent(FileUploadStatus.UPLOAD_COMPLETE)
      );
      xhr.removeEventListener("error", setEvent(FileErrorStatus.ERROR));
      xhr.removeEventListener("abort", setEvent(FileErrorStatus.ABORT));
      xhr.removeEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
      // xhr.onreadystatechange = null;
    };
  }, [setEvent, url, xhr]);
  return (
    <>
      {children({
        ...eventDetails,
      })}
    </>
  );
};
