const selection = figma.currentPage.selection[0]
if (selection.type == "COMPONENT") {
  const componentId = selection.id
  const instancesCount = figma.root.findAll((node) => node.type == "INSTANCE" && node.masterComponent.id == componentId).length
  const hasInstances = instancesCount > 0
  if (!hasInstances) {
    console.log("Removing " + selection.name)
    selection.remove()
  } else {
    console.log(`${selection.name} has ${instancesCount} instances and won't be removed`)
  }
} else {
  console.log(`${selection.name} is not a component`)
}

figma.closePlugin();
