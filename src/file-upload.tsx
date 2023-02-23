import { FC, ReactNode, useEffect } from "react";

import { FileUploadStatus } from "./constants";

export type FileUploadProps = {
  file: File;
  method: string;
  headers: {
    [x: string]: string;
  };
  formRequestData: {
    [x: string]: any;
  };
  children: (data: any) => ReactNode;
  url: string;
};

export const FileUpload: FC<FileUploadProps> = ({
  method = "POST",
  headers = { "X-Requested-With": "XMLHttpRequest" },
  formRequestData = {},
  children,
  file,
  url = "",
}) => {
  const xhr = new XMLHttpRequest();
  const abortRequest = () => {
    xhr.abort();
  };
  const onUploadStart = (event: any) => {
    const newState = {
      request: xhr,
      startUpload: null,
      abortRequest: abortRequest,
    };
    onEvent(FileUploadStatus.UPLOAD_START, event, newState);
  };
  const onEvent = (
    eventName: FileUploadStatus,
    event: string,
    newState = {}
  ) => {
    // onEvent(FileUploader.UPLOAD_READY, event, newState);
    const eventState = {
      [eventName]: event,
      requestState: eventName,
    };
    // Get the latest event and invoke the function prop
    // example onFileDataReady(xhr, {});
    // props[onEventName(eventName)](event, {});
    // setCurrentEvent(Object.assign(newState, eventState));
  };
  const onEventName = (eventName: string) => {
    return `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
  };
  /**
   * To be consumed by client component as a click button to initiate upload
   */
  const startUpload = () => {
    const formData = new FormData();
    Object.keys(formRequestData).forEach((key) =>
      formData.append(key, formRequestData[key])
    );
  };
  useEffect(() => {
    xhr.open(method, url, true);
    Object.keys(headers).forEach((key) =>
      xhr.setRequestHeader(key, headers[key])
    );
  }, []);
  return <>{children}</>;
};

type FileManagerProps = {
  children: Function;
};
export const FileManager: FC<FileManagerProps> = ({ children }) => {
  return <>{}</>;
};
