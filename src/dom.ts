let _parser: DOMParser;
let _serializer: XMLSerializer;

export function getParser() {
  return _parser;
}

export function getSerializer() {
  return _serializer;
}

export function install(parser: DOMParser, serializer: XMLSerializer) {
  _parser = parser;
  _serializer = serializer;
}
