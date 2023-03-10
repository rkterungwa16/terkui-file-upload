import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

import { UploadFile } from "./types";
import {
  FileUploadStatus,
  FileErrorStatus,
  FileDownloadStatus,
} from "./constants";

export const modifySelectedFiles = (selectedFiles: FileList): UploadFile[] => {
  return Array.from(selectedFiles).map((file) => {
    return Object.assign(file, { key: nanoid() });
  });
};

type RequestProps = {
  method: string;
  url: string;
  headers: { [x: string]: any };
};

export const useFileUploadStatus = (requestProps: RequestProps, file: File) => {
  const { method, url, headers } = requestProps;
  const [requestState, setRequestState] = useState<
    FileUploadStatus | null | FileErrorStatus | FileDownloadStatus
  >(null);
  // const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [eventDetails, setEventDetails] = useState<{
    [x: string]: ProgressEvent<XMLHttpRequestEventTarget | FileReader> | null;
  }>({
    [FileUploadStatus.UPLOAD_READY]: null,
    [FileUploadStatus.UPLOAD_START]: null,
    [FileUploadStatus.UPLOAD_PROGRESS]: null,
    [FileUploadStatus.UPLOAD_COMPLETE]: null,
    [FileErrorStatus.ABORT]: null,
    [FileErrorStatus.ERROR]: null,
    [FileErrorStatus.TIMEOUT]: null,
  });

  const xhr = useCallback(() => new XMLHttpRequest(), [])();

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
    xhr.open(method, url, true);
    Object.keys(headers).forEach((key) =>
      xhr.setRequestHeader(key, headers[key])
    );

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
  }, [headers, method, setEvent, url, xhr]);
  return {
    requestState,
    eventDetails,
  };
};
