var deletedComponentPriority = 1;
function isInstance(instance, component) {
    try {
        return instance && instance.type == "INSTANCE" && instance.masterComponent.id == component.id;
    }
    catch (e) {
        console.log("Error checking an instance:");
        console.log(instance);
        console.log(e);
        return false;
    }
}
function hasInstances(component) {
    return figma.root.findOne(function (node) { return isInstance(node, component); }) != null;
}
function removeComponent(component) {
    var messageTextPadding = "    ";
    if (component != undefined && component.type == "COMPONENT" && !component.removed) {
        var name_1 = component.name;
        if (!component.remote) {
            if (!hasInstances(component)) {
                component.remove();
                return {
                    message: "\uD83D\uDDD1" + messageTextPadding + name_1 + " deleted",
                    priority: deletedComponentPriority
                };
            }
            else {
                return {
                    message: "\uD83D\uDD12" + messageTextPadding + name_1 + " has instances and won't be deleted",
                    priority: 2
                };
            }
        }
        else {
            return {
                message: "\uD83D\uDEAB" + messageTextPadding + name_1 + " is read-only",
                priority: 3
            };
        }
    }
    else {
        return {
            message: component ? "\u2753" + messageTextPadding + component.name + " is not a component" : "No component selected",
            priority: 4
        };
    }
}
/* Main logic */
function safeDelete(nodes) {
    var messages = nodes
        .map(function (node) { return removeComponent(node); })
        .sort(function (x, y) { return x.priority - y.priority; });
    if (messages.length == 0 || messages.find(function (res) { return res.priority == deletedComponentPriority; }) == undefined) {
        figma.closePlugin("Nothing to delete");
    }
    else if (messages.length < 4) {
        Object.values(messages).forEach(function (res) { return figma.notify(res.message); });
        figma.closePlugin();
    }
    else {
        var text = Object.values(messages).map(function (res) { return res.message; }).join("\n\n");
        var style = "\n    white-space:pre-wrap;\n    padding: 8px;\n    line-height: 1.5;\n    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n    ";
        figma.showUI("<p style=\"" + style + "\">" + text + "</p>", { width: 500, height: 200 });
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
    console.log("safeDeleteSelection");
    safeDelete(figma.currentPage.selection);
}
function deleteUnusedComponents() {
    console.log("deleteUnusedComponents");
    safeDelete(figma.root.findAll(function (node) { return node.type == "COMPONENT"; }));
}
