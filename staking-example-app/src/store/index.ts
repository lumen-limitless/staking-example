import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { StateCreator } from 'zustand'

//UI SLICE
export interface UISlice {
  viewingModal: boolean
  modalView: null
  toggleViewingModal: (isViewing?: boolean) => void
  setModalView: (view: null) => void
}

const initialState: { viewingModal: boolean; modalView: null } = {
  viewingModal: false,
  modalView: null,
}
const createUISlice: StateCreator<
  UISlice,
  [['zustand/devtools', unknown]],
  []
> = (set) => ({
  ...initialState,
  toggleViewingModal: (isViewing) =>
    set((state) => ({
      viewingModal: isViewing === undefined ? !state.viewingModal : isViewing,
    })),
  setModalView: (view) =>
    set({
      modalView: view,
      viewingModal: view !== null ? true : false,
    }),
})

//ROOT STORE
interface RootSlice extends UISlice {}

const useStore = create<RootSlice>()(
  devtools((...a) => ({
    ...createUISlice(...a),
  }))
)

export default useStore
