import {
  ChangeEvent,
  FC,
  ReactNode,
  useState,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import { nanoid } from "nanoid";

export interface UploadFile extends File {
  key: string;
}

export type UploadManagerProps = {
  children: (data: any) => ReactNode;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  labelProps: LabelHTMLAttributes<HTMLLabelElement>;
};
export const UploadManager: FC<UploadManagerProps> = ({
  children,
  inputProps,
  labelProps,
}) => {
  const { accept = "image/*", type = "file", ...otherInputProps } = inputProps;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const filesLength = files.length;
      const modifiedFileList = [];
      for (let file = 0; file < filesLength; file += 1) {
        const x = files.item(file);
        if (x) {
          modifiedFileList.push(Object.assign(x, { key: nanoid() }));
        }
      }
      setFiles(modifiedFileList);
    }
  };
  return (
    <>
      <input
        {...otherInputProps}
        onChange={handleChange}
        accept={accept}
        style={{
          display: "none",
        }}
        id="file-upload"
        type="file"
      />
      <label {...labelProps} htmlFor="file-upload">
        {children(files)}
      </label>
    </>
  );
};
