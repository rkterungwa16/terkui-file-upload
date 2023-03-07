import {
  ChangeEvent,
  FC,
  ReactNode,
  useState,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  cloneElement,
} from "react";
import { nanoid } from "nanoid";

export interface UploadFile extends File {
  key: string;
}

export type UploadManagerProps = {
  children: (data: any) => ReactNode;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  recieverComponent?: ReactElement;
};
export const UploadManager: FC<UploadManagerProps> = ({
  children,
  inputProps,
  labelProps,
  recieverComponent,
}) => {
  const {
    accept = "image/*",
    type = "file",
    id = "file-upload",
    name = "file-upload",
    ...otherInputProps
  } = inputProps;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let selectedFiles;
    selectedFiles = event.currentTarget.files;
    if (selectedFiles) {
      selectedFiles = Array.from(selectedFiles).map((file) => {
        return Object.assign(file, { key: nanoid() });
      });

      setFiles(selectedFiles);
    }
  };
  return (
    <>
      <input
        {...otherInputProps}
        onChange={handleChange}
        accept={accept}
        id={id}
        name={id}
        type={type}
        hidden
        multiple
      />
      <label {...labelProps} htmlFor={name}>
        {recieverComponent && cloneElement(recieverComponent)}
      </label>
      {children(files)}
    </>
  );
};
