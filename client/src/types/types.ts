export type Id = { id: number };
export type TasksList = Id & {
  name: string;
};
export type Tasks = Task[];
export type Task = Id & {
  content: string;
  ticked: boolean;
  carried: boolean;
  page: number;
};
