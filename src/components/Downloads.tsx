import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Map } from 'immutable';
import RNBackgroundDownloader, {
  DownloadTask,
} from 'react-native-background-downloader';

interface IDownloadContext {
  pending: Map<string, DownloadTask>;
}

const DownloadContext = createContext<IDownloadContext>({
  pending: Map(),
});

export const Downloads: React.FC = ({ children }) => {
  const [pending, setPending] = useState<Map<string, DownloadTask>>(Map());
  useEffect(() => {
    RNBackgroundDownloader.checkForExistingDownloads().then(tasks => {
      setPending(Map(tasks.map(task => [task.id, task])));
      tasks.forEach(task =>
        task.done(() => setPending(last => last.remove(task.id))),
      );
    });
  }, []);

  return (
    <DownloadContext.Provider
      value={{
        pending,
      }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => useContext(DownloadContext);
