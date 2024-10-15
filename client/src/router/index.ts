import {createRouter, createWebHistory, type RouteRecordRaw,} from "vue-router";
import Landing from "../views/Landing.vue";
import Tasks from "../views/Tasks.vue";
import {useMachine} from '@xstate/vue'
import {tasksMachine} from '@/state-machines/tasks.state-machine'

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Landing,
    },
    {
        path: "/tasks",
        component: Tasks,
        props: {
            tasksMachineProvider: () => {
                const {snapshot, send, actorRef} = useMachine(tasksMachine);
                return {snapshot, send, actorRef}
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
