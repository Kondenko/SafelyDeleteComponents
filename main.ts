var deletedComponentPriority = 1;

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

function removeComponent(component: BaseNode): DeleteOperation {
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

function safeDelete(nodes: readonly BaseNode[], onlyReportDeleted: boolean = false) {
  const messages: Array<DeleteOperation> = nodes
    .map((node) => removeComponent(node))
    .sort((x, y) => x.priority - y.priority)
    .filter((res) => !onlyReportDeleted || res.priority == deletedComponentPriority )

  if (messages.length == 0) {
    figma.closePlugin("Nothing selected")
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
}

/* Commands */

switch (figma.command) {
  case "safeDeleteSelection": {
    safeDeleteSelection();
    break;
  }
  case "deleteUnusedComponents": {
    deleteUnusedComponents();
    break;
  }
  default: {
    console.log("Unknown command " + figma.command);
    break;
  }
}

function safeDeleteSelection() {
  console.log("safeDeleteSelection")
  safeDelete(figma.currentPage.selection)
}

function deleteUnusedComponents() {
  console.log("deleteUnusedComponents")
  safeDelete(figma.root.findAll((node: BaseNode) => node.type == "COMPONENT"), true)
}