import {Component} from '@angular/core';
import {NzUploadChangeParam} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReadVideoDto, VideoUploadState} from '../dtos/read-video.dto';
import {AppService} from '../app.service';
import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import * as AWS from 'aws-sdk';
import {DirectUploadDto} from '../dtos/direct-upload.dto';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isPlayerModalVisible = false;
  isVideoUploadModalVisible = false;
  current = 0;
  searchVideo = {title: ''};
  apiEndPoint = environment.apiEndPoint;
  uploadVideoDto = {
    uuid: null,
    title: null,
    description: null,
    ext: null,
    uploadTime: 0,
  };
  isUploading = false;
  uploadMethod = 's3';
  timerId: any;

  videos: ReadVideoDto[] = [];
  selectedVideo: ReadVideoDto;
  user: any;
  userName: string;

  confirmModal?: NzModalRef;

  constructor(
    private readonly nzMessageService: NzMessageService,
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {
    this.authService.userSubject.subscribe(user => {
      this.user = user;
      if (this.user && this.user.idToken && this.user.idToken.payload) {
        this.user = this.user.idToken.payload['cognito:username'];
      }
    });
    this.appService.readVideoDtos().then();
    this.appService.videosBehavior.subscribe(videos => {
      this.videos = videos;
      this.videos.forEach(video => {
        const videoFinder = (targetVideo: ReadVideoDto) => targetVideo.uuid === video.uuid;
        if ((video.upload_state !== VideoUploadState.COMPLETE) && (video.upload_state !== VideoUploadState.ERROR)) {
          const interval = setInterval(async () => {
            const {uuid} = video;
            const videoDto = await this.appService.readVideoDto(uuid);
            const videoIndex = this.videos.findIndex(videoFinder);
            if (videoDto.upload_state === VideoUploadState.COMPLETE) {
              this.videos[videoIndex] = videoDto;
              clearInterval(interval);
            }
          }, 5000);
        }
      });
    });
  }

  showPlayerModal(video: ReadVideoDto): void {
    if (video.upload_state === VideoUploadState.COMPLETE) {
      this.isPlayerModalVisible = true;
      this.selectedVideo = video;
    }
  }

  showVideoUploadModal(): void {
    this.isVideoUploadModalVisible = true;
  }

  createVideo(): void {
    this.appService.loadingBehavior.next(true);
    this.appService.createVideo({
      title: this.uploadVideoDto.title,
      description: this.uploadVideoDto.description,
    }).then(createdVideo => {
      this.appService.loadingBehavior.next(false);
      this.uploadVideoDto.uuid = createdVideo.uuid;
      this.current += 1;
    });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.uploadVideoDto.uploadTime += 1;
      }, 1000);
    }
    if (info.file.status === 'uploading') {
      this.isUploading = true;
    } else if (info.file.status === 'done') {
      this.isUploading = false;
      clearInterval(this.timerId);
      this.timerId = null;
      this.appService.readVideoDto(this.uploadVideoDto.uuid).then(video => {
        this.appService.videosBehavior.next([video, ...this.videos]);
      });
      this.uploadTimeNotification('VPC');
      this.handleCancel();
    } else if (info.file.status === 'error') {
      this.isUploading = false;
      clearInterval(this.timerId);
      this.timerId = null;
      this.uploadVideoDto.uploadTime = 0;
      this.nzMessageService.error(`${info.file.name} file upload failed.`, {nzDuration: 5000});
    }
  }

  customUploadReq = (item: NzUploadXHRArgs) => {
    this.isUploading = true;
    this.uploadVideoDto.ext = `.${item.file.name.split('.').pop()}`;
    const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'ap-northeast-2'});
    const params = {
      Bucket: environment.vodS3Bucket,
      Key: `source/${this.uploadVideoDto.uuid}${this.uploadVideoDto.ext}`,
      Body: item.file,
    };
    this.timerId = setInterval(() => {
      this.uploadVideoDto.uploadTime += 1;
    }, 1000);
    s3.upload(params)
      .on('httpUploadProgress', ({loaded, total}) => {
        item.onProgress(
          {
            percent: Math.round((loaded / total) * 100)
          },
          item.file
        );
      })
      .send((err, data) => {
        if (err) {
          item.onError(err, item.file);
          this.isUploading = false;
          clearInterval(this.timerId);
          this.timerId = null;
          this.nzMessageService.error(err.message, {nzDuration: 5000});
        } else {
          item.onSuccess(data.response, item.file, data);
          clearInterval(this.timerId);
          this.timerId = null;
          this.uploadTimeNotification('S3');
          this.isUploading = false;
          const directUploadDto: DirectUploadDto = {
            uuid: this.uploadVideoDto.uuid,
            ext: this.uploadVideoDto.ext,
          };
          this.appService.directUploadComplete(directUploadDto).then(video => {
            this.appService.videosBehavior.next([video, ...this.videos]);
          });
          this.handleCancel();
          this.nzMessageService.success(`${item.file.name} file uploaded successfully`, {nzDuration: 5000});
        }
      });
  };

  handleCancel(): void {
    this.isPlayerModalVisible = false;
    this.isVideoUploadModalVisible = false;
    this.current = 0;
    this.uploadVideoDto = {
      uuid: null,
      title: null,
      description: null,
      ext: null,
      uploadTime: 0,
    };
  }

  signOut = () => {
    this.authService.signOut();
  }

  uploadTimeNotification = (when: string) => {
    this.notification.create('success', `${when} Upload Time`,
      `${this.uploadVideoDto.uploadTime}s`,
      {nzPlacement: 'bottomRight', nzDuration: 0});
  }

  async deleteConfirm(video: ReadVideoDto): Promise<void> {
    this.appService.loadingBehavior.next(true);
    const result = await this.appService.deleteVideo(video.uuid);
    this.notification.create('success', `${result}`,
      `${result}`,
      {nzPlacement: 'bottomRight', nzDuration: 0});
    await this.appService.readVideoDtos();
    this.appService.loadingBehavior.next(false);
  }
}
