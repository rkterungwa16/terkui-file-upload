import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

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

  // request upload events
  onUploadReady?: (
    e: ProgressEvent<XMLHttpRequestEventTarget | FileReader>
  ) => void;
  onUploadStart?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onUploadProgress?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onUploadComplete?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onDownloadStart?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onDownloadProgress?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onDownloadComplete?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onReadyStateChange?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onFileDataReady?: (e: ProgressEvent<FileReader>) => void;

  // request events
  onError?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onAbort?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
  onTimeout?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
};

export const useFileUploadStatus = (requestProps: RequestProps) => {
  const { method, url, headers, file } = requestProps;
  const xhr = configXhr({
    method,
    url,
    headers,
  });
  const { fileDataUrl } = useReadFileDataAsUrl(file);
  const [ progress, setProgress] = useState({
    fileId: file.fileId,
    point: 0
  })
  const [requestState, setRequestState] = useState<
    FileUploadStatus | null | FileErrorStatus | FileDownloadStatus
  >(null);
  // const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [eventDetails, setEventDetails] = useState<{
    // request upload events
    [FileUploadStatus.UPLOAD_READY]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    [FileUploadStatus.UPLOAD_START]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    [FileUploadStatus.UPLOAD_PROGRESS]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    [FileUploadStatus.UPLOAD_COMPLETE]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    onDownloadStart?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    onDownloadProgress?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    onDownloadComplete?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    onReadyStateChange?: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    onFileDataReady?: (e: ProgressEvent<FileReader>) => void;

    // request events
    [FileErrorStatus.ERROR]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    [FileErrorStatus.ABORT]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
    [FileErrorStatus.TIMEOUT]?: (
      e: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void;
  }>({
    [FileUploadStatus.UPLOAD_READY]: requestProps.onUploadReady,
    [FileUploadStatus.UPLOAD_START]: requestProps.onUploadStart,
    [FileUploadStatus.UPLOAD_PROGRESS]: requestProps.onUploadProgress,
    [FileUploadStatus.UPLOAD_COMPLETE]: requestProps.onUploadComplete,
    [FileErrorStatus.ABORT]: requestProps.onAbort,
    [FileErrorStatus.ERROR]: requestProps.onError,
    [FileErrorStatus.TIMEOUT]: requestProps.onError,
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
  return {
    requestState,
    eventDetails,
  };
};
