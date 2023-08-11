import { FC, ReactNode, useEffect, useState } from "react";

import { FileUploadStatus } from "./constants";
import { useFileUploadStatus } from "./utils";

// An Effect lets you keep your component synchronized with some external system (like a chat service).
// Here, external system means any piece of code that’s not controlled by React, such as:

// A timer managed with setInterval() and clearInterval().
// An event subscription using window.addEventListener() and window.removeEventListener().
// A third-party animation library with an API like animation.start() and animation.reset().

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

export const XUpload: FC<FileUploadProps> = ({
  method = "POST",
  headers = { "X-Requested-With": "XMLHttpRequest" },
  formRequestData = {},
  children,
  file,
  url = "",
}) => {
  const { requestState, eventDetails } = useFileUploadStatus(
    {
      method,
      url,
      headers,
    },
    file
  );

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

  /**
   * To be consumed by client component as a click button to initiate upload
   */
  const startUpload = () => {
    const formData = new FormData();
    Object.keys(formRequestData).forEach((key) =>
      formData.append(key, formRequestData[key])
    );
  };
  return (
    <>
      {children({
        requestState,
        eventDetails,
      })}
    </>
  );
};

type FileManagerProps = {
  children: ReactNode;
  number: number;
};
export const FileManager: FC<FileManagerProps> = ({ children, number }) => {
  const [currentState, setCurrentState] = useState(0);
  useEffect(() => {
    // setCurrentState(number);
  }, [number]);

  console.log("current state -->>", currentState);
  console.log("children -->>", children);
  return <>{children}</>;
};
