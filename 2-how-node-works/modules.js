const C = require("./calculator");

const calc1 = new C();
console.log(calc1.add(2, 5));

// console.log(arguments);
/* Answer:
[Arguments] {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: {
      id: '.',
      path: 'E:\\Practice code\\Node practice\\2-how-node-works',
      exports: {},
      filename: 'E:\\Practice code\\Node practice\\2-how-node-works\\modules.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      'E:\\Practice code\\Node practice\\2-how-node-works\\modules.js': [Object]
    }
  },
  '2': {
    id: '.',
    path: 'E:\\Practice code\\Node practice\\2-how-node-works',
    exports: {},
    filename: 'E:\\Practice code\\Node practice\\2-how-node-works\\modules.js',
    loaded: false,
    children: [],
    paths: [
      'E:\\Practice code\\Node practice\\2-how-node-works\\node_modules',
      'E:\\Practice code\\Node practice\\node_modules',
      'E:\\Practice code\\node_modules',
      'E:\\node_modules'
    ]
  },
  '3': 'E:\\Practice code\\Node practice\\2-how-node-works\\modules.js',
  '4': 'E:\\Practice code\\Node practice\\2-how-node-works'
}
*/

// console.log(require("module").wrapper);

/* 
[
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
]
*/
