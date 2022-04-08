export interface ICommentType<T> {
  _id: T,
  title: string, // 标题
  authorId: string, // 创建人
  replyId: string, // 创建人
  content: string, // 正文
  createdAt: Date, // 创建时间
  updatedAt: Date // 修改时间
}
