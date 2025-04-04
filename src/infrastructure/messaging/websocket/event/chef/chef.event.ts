import ChefStatusNotification from "./chef-status.event"
import ChefSubscription from "./chef-subscription.event"

type ChefEvent = ChefStatusNotification | ChefSubscription

export default ChefEvent