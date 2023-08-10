import { FC, DragEvent, ChangeEvent, useState } from 'react';

export type FileUploadProps = {
  imageButton?: boolean;
  accept: string;
  hoverLabel?: string;
  fileTypeLabel?: string;
  dropLabel?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  image?: {
    url: string;
    imageStyle?: {
      width?: string;
      height?: string;
    };
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
};

export const FileUpload: FC<FileUploadProps> = ({
  accept,
  imageButton = false,
  hoverLabel = 'Click to upload or drag and drop',
  dropLabel = 'Drop file here',
  fileTypeLabel = 'CSV or XML (max. 5mb)',
  width = '400px',
  height = '126px',
  backgroundColor = '#fff',
  image: {
    url = '',
    imageStyle = {
      height: 'inherit',
    },
  } = {},
  onChange,
  onDrop,
}) => {
  const [imageUrl, setImageUrl] = useState(url);
  const [labelText, setLabelText] = useState<string>(hoverLabel);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const stopDefaults = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
    onDrop: (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);
      console.log(' e.dataTransfer.files', e.dataTransfer.files);
      if (imageButton && e.dataTransfer.files[0]) {
        setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]));
      }
      onDrop(e);
    },
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('event.target.files', event.target.files);
    if (imageButton && event?.target?.files) {
      setImageUrl(URL.createObjectURL(event?.target?.files[0]));
    }

    onChange(event);
  };

  return (
    <>
      <input
        onChange={handleChange}
        accept={accept}
        style={{
          display: 'none',
        }}
        id="file-upload"
        type="file"
      />

      <label
        htmlFor="file-upload"
        {...dragEvents}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          display: 'flex',
          border: '1px solid #EAECF0',
          borderRadius: '8px',
          padding: '1rem',
          height,
          width,
        }}
      >
        {/* Wrapper */}
        <>

          {(!imageButton || isDragOver || isMouseOver) && (
            <>
            </>
          )}
        </>
      </label>
    </>
  );
};

const fileUploadProp: FileUploadProps = {
  accept: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.xml',
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      console.log(`Saving ${event.target.value}`);
    }
  },
  onDrop: (event: React.DragEvent<HTMLElement>) => {
    console.log(`Drop ${event.dataTransfer.files[0].name}`);
  },
};

export const UploadDataPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: '45vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0rem 1rem',
    }}
  >
    <FileUpload {...fileUploadProp} />
  </div>
);
