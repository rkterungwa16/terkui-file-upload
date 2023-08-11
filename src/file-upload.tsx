import { nanoid } from "nanoid";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { UploadFile } from "./types";
import {
  FileUploadStatus,
  FileErrorStatus,
  FileDownloadStatus,
} from "./constants";
import {
  configXhr,
  startUpload,
  uploadProgress,
  useReadFileDataAsUrl,
} from "./helpers";

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
    startUpload: (formFile: { file: UploadFile; fileDataUrl: string }) => void;
  }) => ReactNode;
};

export const FileUpload: FC<RequestProps> = ({
  method,
  url,
  headers,
  file,
  children,
}) => {
  const xhr = configXhr({
    method,
    url,
    headers,
  });

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
      setProgress({
        ...progress,
        percent: event.total ? event.loaded / event.total : 0,
      });
    },
    [progress]
  );

  const handleUploadStartEvent = useCallback(
    (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      setRequestState(FileUploadStatus.UPLOAD_START);
    },
    []
  );

  const handleUploadCompleteEvent = useCallback(
    (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      setRequestState(FileUploadStatus.UPLOAD_COMPLETE);
    },
    []
  );

  useEffect(() => {
    xhr.upload.addEventListener("loadstart", handleUploadStartEvent);
    xhr.upload.addEventListener("progress", handleUploadProgress);
    xhr.upload.addEventListener("loadend", handleUploadCompleteEvent);
    // xhr.addEventListener("error", setEvent(FileErrorStatus.ERROR));
    // xhr.addEventListener("abort", setEvent(FileErrorStatus.ABORT));
    // xhr.addEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
    // xhr.onreadystatechange = onReadyStateChange;
    return () => {
      xhr.upload.removeEventListener("loadstart", handleUploadStartEvent);
      xhr.upload.removeEventListener("progress", handleUploadProgress);
      xhr.upload.removeEventListener("loadend", handleUploadCompleteEvent);
      // xhr.removeEventListener("error", setEvent(FileErrorStatus.ERROR));
      // xhr.removeEventListener("abort", setEvent(FileErrorStatus.ABORT));
      // xhr.removeEventListener("timeout", setEvent(FileErrorStatus.TIMEOUT));
      // xhr.onreadystatechange = null;
    };
  }, [
    xhr,
    handleUploadProgress,
    handleUploadStartEvent,
    setEvent,
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
