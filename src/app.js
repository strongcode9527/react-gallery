require('./style/index.css');
var React = require('react');
var ReactDom = require('react-dom');

var Gallery = require('./script/gallery.js');
var Dom = document.getElementById('container');

ReactDom.render(<Gallery />,Dom);
