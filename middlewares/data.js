import {getDress, getDresses, addToHitlist, removeFromHitlist, getSimilarDresses} from  '../dataservice/api'
import actionTypes from  '../constants/actions'

const dataMiddleware = store => next => async (action) => {

  next(action)

  const state = store.getState()

  switch (action.type) {

    case actionTypes.VIEW_ITEM:
      const item = await getDress(action.id)
      next({ type: actionTypes.LOAD_ITEM, id:action.id, details: item })
      break
    
    case actionTypes.GET_ITEMS:
      const {items, totalPages} = await getDresses(action.pageSize, action.pageNum)
      next({ type: actionTypes.LOAD_ITEMS, items, totalPages })
      break

    case actionTypes.GET_SIMILAR:
      const similar= await getSimilarDresses(action.id)
      if (similar.items){
        next({ type: actionTypes.LOAD_SIMILAR_ITEMS, id:action.id, items:similar.items })
      }
      break

    case actionTypes.SAVE_ITEM:
      const savedItem = await addToHitlist(action.id, action.rating)
      const details = JSON.parse(savedItem)
      if (details.dress_id){
        next({ type: actionTypes.SAVE_ITEM_HITLIST, id:action.id, details })
      }
      break

    case actionTypes.REMOVE_ITEM:
      const findItem = state.hitlist.find( (item) => {
        return item.dress_id == action.id
      })
      const deletedItem = await removeFromHitlist(findItem.line_id)
      next({ type: actionTypes.DELETE_ITEM_HITLIST, id:action.id })
      break

    default:
      break

  }
}

export default dataMiddleware