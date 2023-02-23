export enum FileUploadStatus {
  UPLOAD_READY = "uploadReady",
  UPLOAD_START = "uploadStart",
  UPLOAD_PROGRESS = "uploadProgress",
  UPLOAD_COMPLETE = "uploadComplete",
  DOWNLOAD_START = "downloadStart",
  DOWNLOAD_PROGRESS = "downloadProgress",
  DOWNLOAD_COMPLETE = "downloadComplete",
  ERROR = "error",
  ABORT = "abort",
  TIMEOUT = "timeout"
}
