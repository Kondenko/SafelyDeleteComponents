const selection = figma.currentPage.selection[0]

var message: String

if (selection.type == "COMPONENT") {
  const componentId = selection.id
  const instancesCount = figma.root.findAll((node) => node.type == "INSTANCE" && node.masterComponent.id == componentId).length
  const hasInstances = instancesCount > 0
  if (!hasInstances) {
    selection.remove()
    message = `${selection.name} removed`
  } else {
    message = `${selection.name} has ${instancesCount} instances and won't be removed`
  }
} else {
  message = `${selection.name} is not a component`
}

figma.closePlugin(message);
