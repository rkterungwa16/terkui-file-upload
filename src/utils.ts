import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import { UploadFile } from "./types";

export const modifySelectedFiles = (selectedFiles: FileList): UploadFile[] => {
  return Array.from(selectedFiles).map((file) => {
    return Object.assign(file, { fileId: nanoid() });
  });
};

// export function to be used by a consuming action
// use internally if automatic upload is set to true.
// export returned function

export type FormDataProps = { [key: string]: string | File };
export const startUpload = (xhr: XMLHttpRequest) => {
  return (formDataDetails: FormDataProps) => {
    const formData = new global.FormData();
    Object.keys(formDataDetails).forEach((key) =>
      formData.append(key, formDataDetails[key])
    );
    return xhr.send(formData);
  };
};

export const configXhr = ({
  method,
  url,
  headers,
}: {
  method: string;
  url: string;
  headers: { [name: string]: string };
}) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  Object.keys(headers).forEach((key) =>
    xhr.setRequestHeader(key, headers[key])
  );
  return xhr;
};

export const useReadFileDataAsUrl = (file: UploadFile) => {
  const [fileDataUrl, setFileDataUrl] = useState("");
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        setFileDataUrl(result ? result.toString() : "");
      };
      reader.readAsDataURL(file);
    }
  }, [file]);
  return {
    fileDataUrl,
  };
};

export const uploadProgress = (
  file: UploadFile,
  handleUploadProgressEvent: (progress: {
    fileId: string;
    percent: number;
  }) => void
) => {
  return (event: ProgressEvent<XMLHttpRequestEventTarget | FileReader>) => {
    const progress = {
      fileId: file.fileId,
      percent: event.total ? event.loaded / event.total : 0,
    };
    handleUploadProgressEvent(progress);
  };
};
