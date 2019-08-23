const selection = figma.currentPage.selection

var message

if (selection.length == 1) {
  const selectedNode = selection[0]
  if (selectedNode != undefined && selectedNode.type == "COMPONENT" && !selectedNode.removed) {
    if (!selectedNode.remote) {
      const name = selectedNode.name
      const componentId = selectedNode.id
      const instancesCount = figma.root.findAll((node) => node.type == "INSTANCE" && node.masterComponent.id == componentId).length
      const hasInstances = instancesCount > 0
      if (!hasInstances) {
        selectedNode.remove()
        message = `${name} removed`
      } else {
        message = `${name} has ${instancesCount} instances and won't be removed`
      }
    } else {
      message = `${name} is read-only`
    }
  } else {
    message = selectedNode ? `${name} is not a component` : "No component selected"
  }
} else {
  message = "Select 1 object"
}

figma.closePlugin(message);
