import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReadVideoDto} from './dtos/read-video.dto';
import {environment} from '../environments/environment';
import {CreateVideoDto} from './dtos/create-video.dto';
import {BehaviorSubject} from 'rxjs';
import {DirectUploadDto} from './dtos/direct-upload.dto';

@Injectable()
export class AppService {
  public apiEndPoint = environment.apiEndPoint;
  public loadingBehavior: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public videosBehavior: BehaviorSubject<ReadVideoDto[]> = new BehaviorSubject<ReadVideoDto[]>([]);

  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  async createVideo(createVideoDto: CreateVideoDto): Promise<ReadVideoDto> {
    return new Promise(resolve => {
      this.httpClient.post(`${this.apiEndPoint}/videos`, createVideoDto).subscribe((video: ReadVideoDto) => {
        resolve(video);
      });
    });
  }

  async readVideoDto(videoUUID: string): Promise<ReadVideoDto> {
    return new Promise(resolve => {
      this.httpClient.get(`${this.apiEndPoint}/videos/${videoUUID}`).subscribe((video: ReadVideoDto) => {
        resolve(video);
      });
    });
  }

  async deleteVideo(videoUUID: string): Promise<string> {
    return new Promise(resolve => {
      this.httpClient.delete(`${this.apiEndPoint}/videos/${videoUUID}`).subscribe((result: string) => {
        resolve(result);
      });
    });
  }

  async readVideoDtos(): Promise<ReadVideoDto[]> {
    return new Promise(resolve => {
      this.httpClient.get(`${this.apiEndPoint}/videos`).subscribe((videos: ReadVideoDto[]) => {
        this.videosBehavior.next(videos);
        resolve(videos);
      });
    });
  }

  async directUploadComplete(directUploadDto: DirectUploadDto): Promise<ReadVideoDto> {
    return new Promise(resolve => {
      this.httpClient.put(`${this.apiEndPoint}/direct-upload-complete`, directUploadDto).subscribe((video: ReadVideoDto) => {
        resolve(video);
      });
    });
  }
}
