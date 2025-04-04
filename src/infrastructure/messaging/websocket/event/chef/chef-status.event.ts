import ChefLocation from "src/domain/enums/chef-location.enum"
import ChefStatus from "src/domain/enums/chef-status.enum"
import BaseEvent from "../base.event"
import ChefStatusEventType from "./chef-status-type.event"

interface ChefStatusNotification extends BaseEvent {
  type: ChefStatusEventType,
  data: {
    chefId: string,
    newStatus?: ChefStatus,
    location?: ChefLocation,
    bookingId?: string,
    updatedAt: string
  },
  timestamp?: number
  targetUserId?: string
}

export default ChefStatusNotification
