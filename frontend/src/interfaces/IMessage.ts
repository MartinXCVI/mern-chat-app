export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}