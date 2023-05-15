import "../css/style.css";
import "../css/reset.css";
import {Application} from "./application";
import {ApplicationForm} from "./application";
import {ApplicationStatusUpdate} from "./application";
import {ApplicationDelete} from "./application";

window.addEventListener("load", () => {
  const app = new Application();
  app.start();

  const appForm = new ApplicationForm();
  appForm.start();

  const appStatus = new ApplicationStatusUpdate();
  appStatus.start();

  const appDelte = new ApplicationDelete();
  appDelte.start();
});
