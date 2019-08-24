const selection = figma.currentPage.selection

const priorityDeleted = 1

interface DeleteOperation {
  message: string
  priority: number
}

function isInstance(node: SceneNode, componentId: String) {
  try {
    return node && node.type == "INSTANCE" && node.masterComponent.id == componentId
  } catch (e) {
    console.log("Error traversing the document")
    console.log(node)
    console.log(e)
    return false
  }
}

function removeComponent(component: SceneNode): DeleteOperation {
  const messageTextPadding: string = "    "
  if (component != undefined && component.type == "COMPONENT" && !component.removed) {
    const name: string = component.name
    if (!component.remote) {
      const componentId = component.id
      const hasInstances = figma.root.findOne(node => isInstance(node, componentId)) != null
      if (!hasInstances) {
        component.remove()
        return { 
          message: `🗑${messageTextPadding}${name} deleted`,
          priority: 1 
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


const messages: Array<DeleteOperation> = selection.map(node => removeComponent(node)).sort((x, y) => x.priority - y.priority)

if (messages.find(res => res.priority == priorityDeleted) == undefined) {
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