import { AppController } from "./apputils";
import { ExampleViewController } from "./views/example"
import { ExampleListViewController } from "./views/list_example"

const controller = new AppController();
controller.init({
    "example"      : new ExampleViewController(),
    "list_example" : new ExampleListViewController(),
});

// Select the first view after 1 second
// ----------------------------------------------------------------------------
setTimeout(() => {
    controller.navigate("example");
}, 1000);
