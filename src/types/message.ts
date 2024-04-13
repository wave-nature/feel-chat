export interface Message {
  message: string;
  to: any;
  from: any;
  feel_mode?: boolean;
  feel_data?: any;
  room_code: string | null;
}
