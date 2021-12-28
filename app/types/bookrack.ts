export interface IBookrackGroupType {
  _id: string,
  title: string,
  desc: string,
  children: IBookrackType[],
  createdAt: Date,
  updatedAt: Date
}

export interface IBookrackType {
  _id: string,
  title: string,
  author: string,
  cover: string,
  desc: string,
  readed: boolean,
  heard: boolean,
  purchased: boolean,
  ISBN: string,
  tags: [],
  rating: number,
  createdAt: Date,
  updatedAt: Date
}
