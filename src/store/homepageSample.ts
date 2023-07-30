import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface IHomepageSampleState {
  counter: number
  increaseCounter: (by: number) => void
}

export const useHomepageSampleStore = create<IHomepageSampleState>()(
  persist(
    devtools(
      (set) => ({
        counter: 0,
        increaseCounter: (by: number) =>
          set(
            (state) => ({ counter: state.counter + by }),
            false,
            'increaseCounter'
          ),
      }),
      { name: 'Homepage Sample Store' }
    ),
    {
      name: 'homepage-sample-storage',
    }
  )
)
