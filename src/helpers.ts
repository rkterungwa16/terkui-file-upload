import { useEffect, useState } from "react";
import {
  FileDownloadStatus,
  FileErrorStatus,
  FileUploadStatus,
} from "./constants";
import { UploadFile } from "./types";

// export function to be used by a consuming action
// use internally if automatic upload is set to true.
// export returned function

export const startUpload = (xhr: XMLHttpRequest) => {
  return (formFile: { file: UploadFile; fileDataUrl: string }) => {
    const formData = new global.FormData();
    formData.append(formFile.file.fileId, formFile.file);
    formData.append("fileDataUrl", formFile.fileDataUrl);
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
