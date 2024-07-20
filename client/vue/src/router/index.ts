import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Landing from "../views/Landing.vue";
import Notes from "../views/Notes.vue";
import { useMachine } from '@xstate/vue'
import { notesMachine } from '@/state-machines/notes.state-machine'

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Landing,
  },
  {
    path: "/notes",
    component: Notes,
    props: { notesMachineProvider: () => {  
        const { snapshot, send, actorRef } = useMachine(notesMachine); 
        return { snapshot, send, actorRef } 
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
