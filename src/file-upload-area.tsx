import { FC, ReactNode, LabelHTMLAttributes } from "react";

export interface FileUploadAreaProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}
export const FileUploadArea: FC<FileUploadAreaProps> = ({
  children,
  htmlFor,
  ...others
}) => {
  return (
    <label {...others} htmlFor={htmlFor}>
      {children}
    </label>
  );
};
