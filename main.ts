const selection: readonly SceneNode[] = figma.currentPage.selection

const deletedComponentPriority = 1

interface DeleteOperation {
  message: string
  priority: number
}

function isInstance(instance: SceneNode, component: SceneNode): boolean {
  try {
    return instance && instance.type == "INSTANCE" && instance.masterComponent.id == component.id
  } catch (e) {
    console.log("Error checking an instance:")
    console.log(instance)
    console.log(e)
    return false
  }
}

function hasInstances(component: ComponentNode): boolean {
  return figma.root.findOne((node: SceneNode) => isInstance(node, component)) != null
}

function removeComponent(component: SceneNode): DeleteOperation {
  const messageTextPadding: string = "    "
  if (component != undefined && component.type == "COMPONENT" && !component.removed) {
    const name: string = component.name
    if (!component.remote) {
      if (!hasInstances(component)) {
        component.remove()
        return { 
          message: `🗑${messageTextPadding}${name} deleted`,
          priority: deletedComponentPriority
        }
      } else {
        return { 
          message: `🔒${messageTextPadding}${name} has instances and won't be deleted`,
          priority: 2 
        }
      }
    } else {
      return { 
        message: `🚫${messageTextPadding}${name} is read-only`,
        priority: 3 
      }
    }
  } else {
    return { 
      message: component ? `❓${messageTextPadding}${component.name} is not a component` : "No component selected",
      priority: 4 
    }
  }
}

/* Main logic */

const messages: Array<DeleteOperation> = selection
    .map((node) => removeComponent(node))
    .sort((x, y) => x.priority - y.priority)

if (messages.length == 0) {
  figma.closePlugin("Nothing selected")
} else if (messages.length > 1 && messages.find(res => res.priority == deletedComponentPriority) == undefined) {
  figma.closePlugin("Nothing to delete")
} else if (messages.length < 4) {
  Object.values(messages).forEach(res => figma.notify(res.message))
  figma.closePlugin()
} else {
  const text = Object.values(messages).map(res => res.message).join("\n\n")
  const style =
  `
  white-space:pre-wrap;
  padding: 8px;
  line-height: 1.5;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  `
  figma.showUI(`<p style="${style}">${text}</p>`, { width: 500, height: 200 })
}