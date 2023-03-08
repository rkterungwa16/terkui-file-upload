import { FC, ReactNode, InputHTMLAttributes } from "react";

export interface FileUploadInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}
export const FileUploadInput: FC<FileUploadInputProps> = ({
  children,
  accept = "image/*",
  type = "file",
  id = "file-upload",
  name = "file-upload",
  ...others
}) => {
  return (
    <input
      accept={accept}
      type={type}
      id={id}
      name={name}
      {...others}
      hidden
      multiple
    />
  );
};
