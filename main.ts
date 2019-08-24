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
  if (component != undefined && component.type == "COMPONENT" && !component.removed) {
    const name = component.name
    if (!component.remote) {
      const componentId = component.id
      const instances = figma.root.findOne(node => isInstance(node, componentId))
      const hasInstances = instances != null
      if (!hasInstances) {
        component.remove()
        return `${name} removed`
      } else {
        return `${name} has instances and won't be removed`
      }
    } else {
      return `${name} is read-only`
    }
  } else {
    return component ? `${component.name} is not a component` : "No component selected"
  }
}

// TODO Allow selecting multiple components
if (selection.length == 1) {
  const selectedNode = selection[0]
  console.log(selectedNode)
  figma.closePlugin(removeComponent(selectedNode))
} else {
  figma.closePlugin(`Select 1 object (${selection.length} selected)`)
}