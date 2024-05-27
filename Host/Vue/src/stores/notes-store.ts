import { fromStore } from '@xstate/store'
import { createActor } from 'xstate'
import { type Notes, type Note } from '@/types/types'

const notesStoreLogic = fromStore(
  { notes: [] as Notes },
  {
    add: (context, { note }: { note: Note }) => ({
      notes: context.notes.concat(note)
    })
  }
)

export const notesStore = createActor(notesStoreLogic)
