import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';

import * as videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
import './flor-js/videojs-flor.js';

@Component({
  selector: 'video-player',
  template: `
    <video id="video-player" class="video-js vjs-default-skin" controls>
    </video>
  `,
  styles: []
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @Input() videoURL: string;

  public videoJS = videojs.default;
  public videoPlayer: videojs.VideoJsPlayer;
  private options: videojs.VideoJsPlayerOptions;

  ngAfterViewInit(): void {
    this.options = {
      fluid: true,
      userActions: {
        hotkeys: (e) => {
          if (e.which === 39) {
            this.videoPlayer.currentTime(this.videoPlayer.currentTime() + 10);
          }
          if (e.which === 37) {
            this.videoPlayer.currentTime(this.videoPlayer.currentTime() - 10);
          }
        }
      }
    };
    this.videoPlayer = this.videoJS('video-player', this.options);
    this.videoPlayer.flor();
    this.videoPlayer.src({
      src: this.videoURL,
      type: 'application/x-mpegURL'
    });
  }

  ngOnDestroy(): void {
    this.videoPlayer.dispose();
  }
}
