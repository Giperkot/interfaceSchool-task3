const PUBLIC_PATH = require('path').join(__dirname, 'public');
// const { initBackendStub } = require('./backendStub/backendStub');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: PUBLIC_PATH,
    filename: 'index.js'
  },
  devServer: {
    contentBase: PUBLIC_PATH,
    compress: true,
    port: 3000,
    // before: initBackendStub
  }
};
