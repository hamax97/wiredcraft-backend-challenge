interface IWiredcraftDB {
  create: (collectionName: string, doc: object) => Promise<string>;
  get: (collectionName: string, docId: string) => Promise<object | null>;
  update: (collectionName: string, docId: string, doc: object) => Promise<number>;
}
