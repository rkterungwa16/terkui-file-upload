import { nanoid } from "nanoid";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { UploadFile } from "./types";
import {
  FileUploadStatus,
  FileErrorStatus,
  FileDownloadStatus,
} from "./constants";
import {
  FormDataProps,
  configXhr,
  startUpload,
  uploadProgress,
  useReadFileDataAsUrl,
} from "./utils";

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
  formData?: {
    [key: string]: string | File;
  };
  file: UploadFile;

  children: (data: {
    requestState:
      | FileUploadStatus
      | FileErrorStatus
      | FileDownloadStatus
      | null;
    events: {
      [FileUploadStatus.UPLOAD_READY]: {
        fileDataUrl: string;
      };
      [FileUploadStatus.UPLOAD_PROGRESS]: {
        progress: number;
        fileId: string;
      };
    };
    startUpload: (formData: FormDataProps) => void;
  }) => ReactNode;
};

export const FileUpload: FC<RequestProps> = ({
  method,
  url,
  headers,
  file,
  children,
}) => {
  const xhrRef = useRef(
    configXhr({
      method,
      url,
      headers,
    })
  );

  const xhr = xhrRef?.current;

  const { fileDataUrl } = useReadFileDataAsUrl(file);
  const [progress, setProgress] = useState({
    fileId: file.fileId,
    percent: 0,
  });
  const [requestState, setRequestState] = useState<
    FileUploadStatus | null | FileErrorStatus | FileDownloadStatus
  >(null);
  // For each event set it as the current request state.
  //
  // const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [events, setEvents] = useState({
    [FileUploadStatus.UPLOAD_READY]: {
      fileDataUrl,
    },
    [FileUploadStatus.UPLOAD_PROGRESS]: {
      progress: 0,
      fileId: file.fileId,
    },
  });

  useEffect(() => {
    if (fileDataUrl !== events[FileUploadStatus.UPLOAD_READY].fileDataUrl) {
      setEvents({
        ...events,
        [FileUploadStatus.UPLOAD_READY]: {
          fileDataUrl,
        },
      });
    }
  }, [fileDataUrl, events]);

  const setEvent = useCallback(
    (status: FileUploadStatus | FileErrorStatus | FileDownloadStatus) => {
      return (e: ProgressEvent<XMLHttpRequestEventTarget | FileReader>) => {
        setRequestState(status);
        setEvents({
          ...events,
          [status]: e,
        });
      };
    },
    [events]
  );

  const handleUploadProgress = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget | FileReader>) => {
      setRequestState(FileUploadStatus.UPLOAD_PROGRESS);
      const percent = event.total ? event.loaded / event.total : 0;
      console.log("percent___upload__progress", percent);
      setProgress({
        ...progress,
        percent,
      });
    },
    [progress]
  );

  const handleUploadStartEvent = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const percent = event.total ? event.loaded / event.total : 0;
      console.log("percent___upload__start", percent);
      setRequestState(FileUploadStatus.UPLOAD_START);
    },
    []
  );

  const handleUploadCompleteEvent = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const percent = event.total ? event.loaded / event.total : 0;
      console.log("percent___upload__complete", percent);
      setRequestState(FileUploadStatus.UPLOAD_COMPLETE);
    },
    []
  );
  console.log("request state", requestState);
  console.log("progress___", progress);
  useEffect(() => {
    console.log("xhr____");
    if (xhr) {
      xhr.upload.addEventListener("loadstart", handleUploadStartEvent);
      xhr.upload.addEventListener("progress", handleUploadProgress);
      xhr.upload.addEventListener("load", handleUploadCompleteEvent);
      // xhr.addEventListener("error", setEvent(FileErrorStatus.ERROR));
      // xhr.addEventListener("abort", setEvent(FileErrorStatus.ABORT));
      // xhr.addEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
      // xhr.onreadystatechange = onReadyStateChange;
      return () => {
        xhr.upload.removeEventListener("loadstart", handleUploadStartEvent);
        xhr.upload.removeEventListener("progress", handleUploadProgress);
        xhr.upload.removeEventListener("load", handleUploadCompleteEvent);
        // xhr.removeEventListener("error", setEvent(FileErrorStatus.ERROR));
        // xhr.removeEventListener("abort", setEvent(FileErrorStatus.ABORT));
        // xhr.removeEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
        // xhr.onreadystatechange = null;
      };
    }
  }, [
    xhr,
    handleUploadProgress,
    handleUploadStartEvent,
    handleUploadCompleteEvent,
  ]);
  return (
    <>
      {children({
        events,
        startUpload: startUpload(xhr),
        requestState,
      })}
    </>
  );
};
