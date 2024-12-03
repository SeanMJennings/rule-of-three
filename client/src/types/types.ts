export type Id = { id: string };
export type TasksList = Id & {
    name: string;
    tasks: Tasks;
    lastSelectedTime: string;
    ownerEmail: string;
    sharedWith: string[];
    
};
export type Tasks = Task[];
export type Task = Id & {
    content: string;
    ticked: boolean;
    carried: boolean;
    removed: boolean;
    page: number;
};
