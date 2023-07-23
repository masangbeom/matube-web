export enum VideoUploadState {
  TEMP = 'Temp',
  UPLOADING = 'Uploading',
  CONVERTING = 'Converting',
  ERROR = 'Error',
  COMPLETE = 'Complete',
}

export class ReadVideoDto {
  id: number;
  uuid: string;
  title: string;
  description: string;
  url: string;
  thumbnail_img: string;
  original_file_url: string;
  upload_state: VideoUploadState;
  created_at: Date;
  user_name: string;
}
