export enum FileUploadStatus {
  UPLOAD_READY = "upload_ready",
  UPLOAD_START = "upload_start",
  UPLOAD_PROGRESS = "upload_progress",
  UPLOAD_COMPLETE = "upload_complete",
}

export enum FileDownloadStatus {
  DOWNLOAD_START = "download_start",
  DOWNLOAD_PROGRESS = "download_progress",
  DOWNLOAD_COMPLETE = "download_complete",
}

export enum FileErrorStatus {
  ERROR = "error",
  ABORT = "abort",
  TIMEOUT = "timeout"
}
