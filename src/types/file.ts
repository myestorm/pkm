export interface IFileType {
  id: string,
  type: string,
  filepath: string,
  rootpath: string,
  base: string,
  ext: string,
  name: string,

  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
}

export type IFileQueryType = Partial<IFileType>
