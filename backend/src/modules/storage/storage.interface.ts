export type SaveFileInput = {
  key: string;
  buffer: Buffer;
  mimeType: string;
  originalName: string;
};

export type StoredFile = {
  key: string;
};

export interface FileStorage {
  saveFile(input: SaveFileInput): Promise<StoredFile>;
  getFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
  fileExists(key: string): Promise<boolean>;
}

export const FILE_STORAGE = Symbol('FILE_STORAGE');
