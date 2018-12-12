import { JSDOM } from "jsdom";
import { install } from "../src";
import { executeTests as executeConvertersTests } from "./converters";
import { executeTests as executeDecoratorsTests } from "./decorators";
import { executeTests as executeErrorTests } from "./error";
import { executeTests as executeGetLoaderTests } from "./get_load";
import { executeTests as executeNSManagerTests } from "./namespace_manager";
import { executeTests as executeObjectTests } from "./object";
import { executeTests as executeUtilsTests } from "./utils";
import { executeTests as executeXmlCollectionTests } from "./xml_collection";


declare module "jsdom" {
  class DOMWindow {
    XMLSerializer: typeof XMLSerializer;
  }
}

describe("jsdom", async () => {
  
  const jsdom = new JSDOM();
  install(new jsdom.window.DOMParser(), new jsdom.window.XMLSerializer());

  executeConvertersTests();
  executeDecoratorsTests();
  executeErrorTests();
  executeGetLoaderTests();
  executeNSManagerTests();
  executeObjectTests();
  executeUtilsTests();
  executeXmlCollectionTests();
});