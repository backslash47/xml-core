let _parser: DOMParser;
let _serializer: XMLSerializer;
let _xpath: XPathEvaluator;

export function getParser() {
  if (_parser === undefined) {
    throw new Error('No DOM implementation was provided.');
  }

  return _parser;
}

export function getSerializer() {
  if (_serializer === undefined) {
    throw new Error('No DOM implementation was provided.');
  }

  return _serializer;
}

export function getXPathEvaluator() {
  if (_xpath === undefined) {
    throw new Error('No XPath implementation was provided.');
  }

  return _xpath;
}

export function install(parser: DOMParser, serializer: XMLSerializer, xpath: XPathEvaluator) {
  _parser = parser;
  _serializer = serializer;
  _xpath = xpath;
}
