export interface CreateRoom {
  code: string;
  user: {
    id: string;
    email: string;
  };
  type: "old" | "new";
}
