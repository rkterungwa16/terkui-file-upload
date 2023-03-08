import { nanoid } from "nanoid";
import { UploadFile } from "./types";

export const modifySelectedFiles = (selectedFiles: FileList): UploadFile[] => {
  return Array.from(selectedFiles).map((file) => {
    return Object.assign(file, { key: nanoid() });
  });
};
