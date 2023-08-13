import {
  ChangeEventHandler,
  FC,
  ReactNode,
  useState,
  ReactElement,
  cloneElement,
  DragEventHandler,
} from "react";

import { UploadFile } from "./types";
import { modifySelectedFiles } from "./utils";

export type FileUploadManagerProps = {
  method: string;
  url: string;
  headers: { [x: string]: any };
  children: (data: {
    files: UploadFile[];
    method: string;
    url: string;
    headers: { [x: string]: any };
  }) => ReactNode;
  inputComponent: ReactElement;
  uploadAreaComponent: ReactElement;
  hoverLabel?: string;
  dropLabel?: string;
};
export const FileUploadManager: FC<FileUploadManagerProps> = ({
  method,
  url,
  headers,
  hoverLabel = "Click to upload or drag and drop",
  dropLabel = "Drop file here",
  children,
  inputComponent,
  uploadAreaComponent,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [labelText, setLabelText] = useState<string>(hoverLabel);
  const stopDefaults = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const [files, setFiles] = useState<UploadFile[]>([]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let selectedFiles;
    selectedFiles = event.currentTarget.files;
    if (selectedFiles) {
      selectedFiles = modifySelectedFiles(selectedFiles);
      setFiles([...files, ...selectedFiles]);
    }
  };
  const handleDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setLabelText(hoverLabel);
    setIsDragOver(false);
    console.log(" e.dataTransfer.files", event.dataTransfer.files);
    let selectedFiles;
    selectedFiles = event.dataTransfer.files;
    if (selectedFiles) {
      selectedFiles = modifySelectedFiles(selectedFiles);
      setFiles([...files, ...selectedFiles]);
    }
    // if (imageButton && e.dataTransfer.files[0]) {
    //   setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    // }
    // onDrop(e);
  };

  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true);
    },
    onMouseLeave: () => {
      setIsMouseOver(false);
    },
    onDragEnter: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: handleDrop,
  };

  return (
    <>
      {cloneElement(inputComponent, {
        onChange: handleChange,
      })}
      {cloneElement(uploadAreaComponent, {
        ...dragEvents,
      })}

      {children({ files, method, url, headers })}
    </>
  );
};
