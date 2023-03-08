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

export type UploadManagerProps = {
  children: (data: any) => ReactNode;
  inputComponent: ReactElement;
  uploadAreaComponent: ReactElement;
};
export const UploadManager: FC<UploadManagerProps> = ({
  children,
  inputComponent,
  uploadAreaComponent,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let selectedFiles;
    selectedFiles = event.currentTarget.files;
    if (selectedFiles) {
      selectedFiles = modifySelectedFiles(selectedFiles);
      setFiles(selectedFiles);
    }
  };
  const handleDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    let selectedFiles;
    selectedFiles = event.dataTransfer.files;
    if (selectedFiles) {
      selectedFiles = modifySelectedFiles(selectedFiles);
      setFiles(selectedFiles);
    }
  };
  return (
    <>
      {cloneElement(inputComponent, {
        onChange: handleChange,
      })}
      {cloneElement(uploadAreaComponent, {
        onDrop: handleDrop,
      })}

      {children(files)}
    </>
  );
};
