export interface MotivationLetterData {
  recipient: {
    name?: string
    company?: string
    address?: string
  }
  sender: {
    name: string
    address?: string
    contact?: string
  }
  date: string
  subject?: string
  content: string
  signature?: string
} 