import { init } from "./views";

/**
 * Definition for each view in the resources/views folder, and the associated
 * JavaScript module is lazily loaded alongside its view.
 */
const views = init([

    // add gui screens.
    ["base_view", () => import("./views/base_view")],
    // ["main_screen", () => import("./views/main_screen")],

], "./resources/views/");

// Select the first view after 1 second
setTimeout(() => {views.navigate("base_view");}, 500);
