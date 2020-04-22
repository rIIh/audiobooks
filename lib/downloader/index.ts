import RNBackgroundDownloader, { DownloadTask as _DownloadTask, DownloadTaskState } from 'react-native-background-downloader';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';

interface TaskInfo {
  url: string;
  path: string;
  [key: string]: string;
}

interface ProgressState {
  percent: number;
  bytesWritten: number;
  totalBytes: number;
}

export class DownloadTask {
  private task: _DownloadTask;
  private readonly _state: ReplaySubject<ProgressState> = new ReplaySubject(1);
  public get State() {
    return this._state.asObservable();
  }
  public get id(): string {
    return this.task.id;
  }

  public get meta(): TaskInfo {
    return JSON.parse(this.task.id);
  }

  public get state(): DownloadTaskState {
    return this.task.state;
  }

  public get percent(): number {
    return this.task.percent;
  }

  public get bytesWritten(): number {
    return this.task.bytesWritten;
  }

  public get totalBytes(): number {
    return this.task.totalBytes;
  }

  public pause = () => this.task.pause();
  public resume = () => this.task.resume();
  public stop = () => this.task.stop();

  constructor(task: _DownloadTask) {
    this.task = task;
    new Observable<ProgressState>(subscriber => {
      task.progress((percent, bytesWritten, totalBytes) => subscriber.next({ percent, bytesWritten, totalBytes }));
      task.error(error => subscriber.error(error));
      task.done(() => subscriber.complete());
    }).subscribe(this._state);
  }

  static create(url: string, options: { path: string; payload: { [key: string]: string } }): DownloadTask {
    const task = RNBackgroundDownloader.download({
      url,
      destination: RNBackgroundDownloader.directories.documents + '/' + options.path,
      id: JSON.stringify({ url, path: options.path, ...options.payload }),
    });
    return new DownloadTask(task);
  }

  static async checkForExistingDownloads(): Promise<DownloadTask[]> {
    const tasks = await RNBackgroundDownloader.checkForExistingDownloads();
    return tasks.map(task => new DownloadTask(task));
  }

  dispose() {}
}
