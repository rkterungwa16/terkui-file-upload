import { nanoid } from "nanoid";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";

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
  useReadFileDataAsUrl,
} from "./utils";

export const modifySelectedFiles = (selectedFiles: FileList): UploadFile[] => {
  return Array.from(selectedFiles).map((file) => {
    return Object.assign(file, { fileId: nanoid() });
  });
};

export type FileUploadProps = {
  method: string;
  url: string;
  headers: { [x: string]: any };

  // form data
  formData?: {
    [key: string]: string | File;
  };
  file: UploadFile;
  auto?: boolean;
  children: (data: {
    file: UploadFile;
    progress: {
      percent: number;
    };
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
        percent: number;
        timeRemaining: number;
      };
    };
    imageUploadResponse: string;
    startUpload: (formData: FormDataProps) => void;
  }) => ReactNode;
};

export const FileUpload: FC<FileUploadProps> = ({
  method,
  url,
  headers,
  file,
  children,
  auto = false,
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
    percent: 0,
  });
  const [requestState, setRequestState] = useState<
    FileUploadStatus | null | FileErrorStatus | FileDownloadStatus
  >(null);
  const [imageUploadResponse, setImageUploadResponse] = useState("");
  // For each event set it as the current request state.
  //
  // const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [events, setEvents] = useState({
    [FileUploadStatus.UPLOAD_READY]: {
      fileDataUrl,
    },
    [FileUploadStatus.UPLOAD_PROGRESS]: {
      event: null,
      percent: 0,
      timeRemaining: 0,
    },
    [FileUploadStatus.UPLOAD_START]: {
      event: null,
      percent: 0,
      timeRemaining: 0,
    },
    [FileUploadStatus.UPLOAD_COMPLETE]: {
      event: null,
      percent: 0,
      timeRemaining: 0,
    },
  });

  useEffect(() => {
    if (fileDataUrl !== events[FileUploadStatus.UPLOAD_READY].fileDataUrl) {
      setRequestState(FileUploadStatus.UPLOAD_READY);
      setEvents({
        ...events,
        [FileUploadStatus.UPLOAD_READY]: {
          fileDataUrl,
        },
      });
    }
  }, [fileDataUrl, events]);

  const handleSetEvents = useCallback(
    (status: FileUploadStatus | FileErrorStatus | FileDownloadStatus) => {
      return (event: ProgressEvent<XMLHttpRequestEventTarget | FileReader>) => {
        setRequestState(status);
        let timeRemaining;
        const percent = event.total ? event.loaded / event.total : 0;
        if (event.loaded) {
          const uploadSpeed = event.loaded / (event.timeStamp / 1000);
          timeRemaining = Math.floor(
            (event.total - event.loaded) / uploadSpeed
          );
        }
        setProgress({
          ...progress,
          percent,
        });
        setEvents({
          ...events,
          [status]: {
            percent,
            event,
            timeRemaining,
          },
        });
      };
    },
    [events, progress]
  );

  const handleUploadProgress = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      handleSetEvents(FileUploadStatus.UPLOAD_PROGRESS)(event);
    },
    [handleSetEvents]
  );

  const handleUploadStartEvent = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      handleSetEvents(FileUploadStatus.UPLOAD_START)(event);
    },
    [handleSetEvents]
  );

  const handleUploadCompleteEvent = useCallback(
    (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      handleSetEvents(FileUploadStatus.UPLOAD_COMPLETE)(event);
    },
    [handleSetEvents]
  );

  useEffect(() => {
    if (auto && requestState === FileUploadStatus.UPLOAD_READY) {
      startUpload(xhr)({
        file,
        // fileDataUrl:
        //   events.upload_ready.fileDataUrl,
        upload_preset: "terunkom",
        api_key: "811718711578253",
        tags: "demo_upload",
      });
    }
  }, [auto, requestState, xhr, file]);

  useEffect(() => {
    if (xhr) {
      xhr.upload.addEventListener("loadstart", handleUploadStartEvent);
      xhr.upload.addEventListener("progress", handleUploadProgress);
      xhr.upload.addEventListener("load", handleUploadCompleteEvent);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setImageUploadResponse(xhr.response);
        }
      };
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
        progress,
        file,
        events,
        startUpload: startUpload(xhr),
        requestState,
        imageUploadResponse,
      })}
    </>
  );
};
