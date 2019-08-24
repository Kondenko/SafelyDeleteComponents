const selection = figma.currentPage.selection

function isInstance(node, componentId) {
  try {
    return node && node.type == "INSTANCE" && node.masterComponent.id == componentId
  } catch (e) {
    console.log("Error traversing the document")
    console.log(node)
    console.log(e)
    return false
  }
}

function removeComponent(component) {
  const messageTextPadding = "    "
  if (component != undefined && component.type == "COMPONENT" && !component.removed) {
    const name = component.name
    if (!component.remote) {
      const componentId = component.id
      const hasInstances = figma.root.findOne(node => isInstance(node, componentId)) != null
      if (!hasInstances) {
        component.remove()
        return `🗑${messageTextPadding}${name} removed`
      } else {
        return `🔒${messageTextPadding}${name} has instances and won't be removed`
      }
    } else {
      return `🚫${messageTextPadding}${name} is read-only`
    }
  } else {
    return component ? `❓${messageTextPadding}${component.name} is not a component` : "No component selected"
  }
}

const messages = selection.map(node => removeComponent(node))

if (messages.length < 4) {
  messages.forEach(m => figma.notify(m))
  figma.closePlugin()
} else {
  const text = messages.join("\n\n")
  const style =
  `
  white-space:pre-wrap; 
  padding: 0 8px;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  `
  figma.showUI(`<p style="${style}">${text}</p>`, { width: 500, height: 200 })
}