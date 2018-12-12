/// <reference path="./types/index.d.ts" />

import { evaluate } from "xpath-ts";
import { APPLICATION_XML, XmlNodeType } from "./xml";
import { getParser, getSerializer } from "./dom";

function createNSResolver(document: Document): XPathNSResolver {
  const ns: any = {};
  if (document.documentElement) {
    var attrs = document.documentElement.attributes;
    for (var i = 0; i < attrs.length; ++i) {
      if (attrs[i].name.indexOf("xmlns:") == 0) {
        ns[attrs[i].name.substring(6)] = attrs[i].value;
      }
    }
  }
  const nsResolver = function nsResolver(prefix: string | number) {
    return ns[prefix] || null;
  };
  nsResolver.lookupNamespaceURI = nsResolver;
  return nsResolver;
}

export type SelectNodes = (node: Node, xPath: string) => Node[];

function SelectNodesEx(node: Node, xPath: string): Node[] {
  const doc: Document =
    node.ownerDocument == null ? (node as Document) : node.ownerDocument;

  const nsResolver = createNSResolver(doc);

  const personIterator = evaluate(
    xPath,
    node,
    nsResolver,
    0, // XPathResult.ANY_TYPE,
    null!
  );
  const ns: Node[] = [];
  let n: Node;
  while ((n = personIterator.iterateNext())) {
    ns.push(n);
  }
  return ns;
}

export const Select: SelectNodes = SelectNodesEx;

export function Parse(xmlString: string) {
  /**
   * NOTE: https://www.w3.org/TR/REC-xml/#sec-line-ends
   * The XML processor must behave as if it normalized all line breaks in external parsed
   * entities (including the document entity) on input, before parsing, by translating both
   * the two-character sequence #xD #xA and any #xD that is not followed by #xA to a single #xA character.
   */
  xmlString = xmlString.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return getParser().parseFromString(xmlString, APPLICATION_XML);
}

export function Stringify(target: Node) {
  return getSerializer().serializeToString(target);
}

/**
 * Returns single Node from given Node
 *
 * @export
 * @param {Node} node
 * @param {string} path
 * @returns
 */
export function SelectSingleNode(node: Node, path: string) {
  const ns = Select(node, path);
  if (ns && ns.length > 0) {
    return ns[0];
  }
  return null;
}

function _SelectNamespaces(node: Node, selectedNodes: AssocArray<string> = {}) {
  if (node && node.nodeType === XmlNodeType.Element) {
    const el = node as Element;
    if (
      el.namespaceURI &&
      el.namespaceURI !== "http://www.w3.org/XML/1998/namespace" &&
      !selectedNodes[el.prefix || ""]
    ) {
      selectedNodes[el.prefix ? el.prefix : ""] = node.namespaceURI!;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes.item(i);
      if (childNode && childNode.nodeType === XmlNodeType.Element) {
        _SelectNamespaces(childNode, selectedNodes);
      }
    }
  }
}

export function SelectNamespaces(node: Element) {
  const attrs: AssocArray<string> = {};
  _SelectNamespaces(node, attrs);
  return attrs;
}

export function assign(target: any, ...sources: any[]) {
  const res = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    const obj = arguments[i];
    for (const prop in obj) {
      if (!obj.hasOwnProperty(prop)) {
        continue;
      }
      res[prop] = obj[prop];
    }
  }
  return res;
}
