export default {
  namespaced: true,
  state: {
		tenderSectionId: ''
  },
  getters: {
    
  },
  mutations: {
		setTenderSectionId(state, tenderSectionId) {
			state.tenderSectionId = tenderSectionId
		},
  }
}
