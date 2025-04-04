import BaseEvent from "../base.event"
import ChefStatusEventType from "./chef-status-type.event"

interface ChefSubscription extends BaseEvent {
  type: ChefStatusEventType
  data: {
    chefId: string,
    bookingId?: string
  }
}

export default ChefSubscription
