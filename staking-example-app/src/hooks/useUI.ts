import useStore from '../store'

export const useUI = () => {
  const setModalView = useStore((state) => state.setModalView)
  const toggleViewingModal = useStore((state) => state.toggleViewingModal)
  const viewingModal = useStore((state) => state.viewingModal)
  const modalView = useStore((state) => state.modalView)

  return {
    setModalView,
    toggleViewingModal,
    modalView,
    viewingModal,
  }
}
