const { addEventListener, create } = window.notifications;

// do this as part of your app initialisation/loading service and not based on some user interaction
// as you want to be able to react to notifications if you relaunch your app and someone clicks on a
// notification (or if the notification relaunches your app):

// when your code is initialised you can add functions to handle tasks (this would be done within your service)
let taskRegistry = {
  default: (event) => {
    console.log("Notification Task Id Not Supported: " + JSON.stringify(event));
  }
};

taskRegistry["on-close"] = (event) => {
  console.log("Notification onClose: " + JSON.stringify(event));
};

taskRegistry["on-select"] = (event) => {
  console.log("Notification onSelect: " + JSON.stringify(event));
};

taskRegistry["button1-click"] = async (event) => {
  console.log("Notification Button 1 Clicked: " + JSON.stringify(event));
  let winOption = {
    name: "child-" + Date.now(),
    defaultWidth: 300,
    defaultHeight: 300,
    url: window.location.origin + "/samplewindow.html",
    frame: true,
    autoShow: true
  };
  await window.fin.Window.create(winOption);
};

addEventListener("notification-action", (event) => {
  // you would put your custom logic here. For now we just log it to the console.
  // Example registry of actions where you assign functions against a task
  let taskHandler = taskRegistry[event.result.task];
  if (taskHandler !== undefined) {
    taskHandler(event);
  } else {
    taskRegistry.default(event);
  }
});

// if you are interested in the creation of your notifications (e.g. for auditing purposes) you can listen for that as well
addEventListener("notification-created", async (event) => {
  // you would put your custom logic here. For now we just log it to the console.
  console.log("Notification created: " + JSON.stringify(event));
});

const notification = {
  title: "Notification Title To Show",
  category: "Demo Category",
  body:
    "Body of Notification with *markdown support* (with the exception of links & code blocks). ![Book](https://uploads.codesandbox.io/uploads/user/3284dfd1-a303-4a34-b155-878334bf1f99/hq0z-book.png)",
  icon: "https://openfin.co/favicon.ico",
  onClose: {
    task: "on-close",
    supportingData: {
      canBeAnything: "supportingData can be called anything other than task."
    }
  },
  onSelect: {
    task: "on-select",
    supportingData: {
      canBeAnything: "supportingData can be called anything other than task."
    }
  },
  buttons: [
    {
      title: "Trigger Window",
      iconUrl: "https://openfin.co/favicon.ico",
      type: "button",
      onClick: {
        task: "button1-click",
        customData: {
          message: "entry 1 data to send back when this entry is clicked"
        }
      }
    },
    {
      title: "Dismiss",
      iconUrl: "https://openfin.co/favicon.ico",
      type: "button"
    }
  ]
};

setTimeout(() => {
  // simulate some data coming from a backend poll or websocket and create a notification
  create(notification);
}, 10000);
