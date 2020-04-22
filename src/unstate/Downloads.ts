import { createContainer } from 'unstated-next';
import { useCallback, useEffect, useState } from 'react';
import { Map } from 'immutable';
import RNFS from 'react-native-fs';
import { DownloadTask } from '../../lib/downloader';
import { noop } from 'rxjs';
import RNBackgroundDownloader from 'react-native-background-downloader';

type DownloadsMap = Map<string, DownloadTask>;

export enum Failed {
  NotEnoughSpace = 'Not enough space',
}

const useDownloads = () => {
  const [tasks, setTasks] = useState<DownloadsMap>(Map());
  useEffect(() => console.log('Tasks updated', tasks), [tasks]);

  const push = useCallback(
    async (url: string, options?: { path: string; payload: { [key: string]: string } }): Promise<DownloadTask | Failed | undefined> => {
      if (!options || tasks.get(url) != null) {
        return;
      }
      const task = DownloadTask.create(url, { ...options, path: `tmp/${options.path}` });
      const storagePath = RNBackgroundDownloader.directories.documents;

      if (task.totalBytes > (await RNFS.getFSInfo()).freeSpace + 1e9) {
        return Failed.NotEnoughSpace;
      }
      setTasks(last => last.set(url, task));
      task.State.subscribe(
        noop,
        error => {
          setTasks(last => last.remove(url));
          console.warn(error);
        },
        async () => {
          await RNFS.moveFile(storagePath.concat('/', `tmp/${options.path}`), storagePath.concat('/', options.path));
          setTasks(last => last.remove(url));
          console.log('Download completed', decodeURI(url));
        },
      );
      return task;
    },
    [tasks],
  );
  useEffect(() => {
    DownloadTask.checkForExistingDownloads().then(existingTasks => {
      setTasks(last => last.merge(existingTasks.map(task => [task.meta.url, task])));
      existingTasks.forEach(task => {
        const url = task.meta.url;
        task.State.subscribe(
          noop,
          error => {
            setTasks(last => last.remove(url));
            console.warn(error);
          },
          () => {
            setTasks(last => last.remove(url));
            console.log('Download completed', decodeURI(url));
          },
        );
      });
    });
  }, []);

  return {
    push,
    tasks: tasks,
  };
};

const Downloads = createContainer(useDownloads);

export default Downloads;
