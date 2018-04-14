var webpack = require('webpack');
var path = require('path');
var srcDir = path.resolve(process.cwd(), 'src');
var assetsDir = path.resolve(process.cwd(), 'public');
var commonsPlugin = webpack.optimize.CommonsChunkPlugin;
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var htmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var plugins = [
  new commonsPlugin({
    name: 'common',
    minChunks: 2
  }),
  new CleanWebpackPlugin(['public'], {
    verbose: true
  }),
  new CopyWebpackPlugin([{
    from: srcDir + '/lib',
    to: assetsDir + '/lib'
  }, {
    from: srcDir + '/down',
    to: assetsDir + '/down'
  }, {
    from: srcDir + '/i18n',
    to: assetsDir + '/i18n'
  }, {
    from: srcDir + '/favicon.ico',
    to: assetsDir
  }, {
    from: srcDir + '/error',
    to: assetsDir + '/error'
  }, {
    from: srcDir + '/error-page.html',
    to: assetsDir
  }, {
    from: srcDir + '/image/pactl/userName.png',
    to: assetsDir + '/images/userName.png'
  }]),
  new htmlPlugin({
    template: srcDir + '/index.html',
    filename: assetsDir + '/index.html',
    chunks: ['common', 'app', 'vendor'],
    inject: 'body',
    hash: true
  }),
  new ExtractTextPlugin('[name].css'),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/index.html',
    filename: assetsDir + '/binding.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/list/list.html',
    filename: assetsDir + '/list.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/list/showPDF.html',
    filename: assetsDir + '/showPDF.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),  
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/singleWaybill/singleWaybill.html',
    filename: assetsDir + '/singleWaybill.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/singleWaybill/subList.html',
    filename: assetsDir + '/subList.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/cargoSearch/cargoSearch.html',
    filename: assetsDir + '/cargoSearch.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/creatBarcode/creatBarcode.html',
    filename: assetsDir + '/creatBarcode.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/airLine/airLine.html',
    filename: assetsDir + '/airLine.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/airLine/airSubList.html',
    filename: assetsDir + '/airSubList.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/airLine/multipleWaybill.html',
    filename: assetsDir + '/multipleWaybill.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  }),
  new htmlPlugin({
    template: srcDir + '/pactl/wechat/list/barCode.html',
    filename: assetsDir + '/barCode.html',
    chunks: ['common', 'wechat'],
    inject: 'body',
    hash: true
  })
];

if (process.env.NODE_ENV) {
  plugins.push(new uglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    drop_debugger: true,
    drop_console: true
  }));
}
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    'app': './app.js',
    'vendor': ['angular', 'angular-ui-bootstrap', 'angular-ui-router', 'angular-w5c-validator',
      'angular-resource', 'ui-select', 'angular-sanitize', 
      'angular-translate', 'angular-translate-loader-partial', 
      'angular-ui-sortable', 'angular-ui-tree', 'pikaday-angular', 'angular-bootstrap-colorpicker',
      'ngclipboard', 'ag-cookie', 'oclazyload', 'angular-nice-bar', 'angular-shims-placeholder',
      'angular-echarts', 'angular-ui-notification','angular-plupload'
    ],
    'wechat': './pactl/wechat/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
    chunkFilename: 'chunks/[name].[chunkhash].js'
  },
  resolve: {
    root: [srcDir, './node_modules'],
    alias: {
      'angular-ui-bootstrap': './lib/angular-ui-bootstrap/ui-bootstrap-tpls.js',
      'angular-w5c-validator': './lib/angular-w5c-validator/w5cValidator.js',
      'angular-ui-tree': './lib/angular-ui-tree/angular-ui-tree.min.js',
      'angular-bootstrap-colorpicker': './lib/colorpicker/colorpicker-module.js',
      'ui-select': './lib/ui-select/select.js',
      'ngclipboard': './lib/clipboard/ngclipboard.js',
      'ag-cookie': './lib/ag-cookie/ag-cookie.min.js',
      'angular-nice-bar': './lib/angular-nice-bar/angular-nice-bar.js',
      'angular-shims-placeholder': './lib/angular-shims-placeholder/angular-shims-placeholder.min.js',
      'angular-echarts': './lib/angular-echarts/angular-echarts.js',
      'angular-ui-notification': './lib/angular-ui-notification/angular-ui-notification.js',
      'angular-plupload': './lib/plupload/plupload-angular-directive.js'
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.(htm|html)$/i,
      loader: 'html-withimg-loader'
    }, {
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.css$/,
      exclude: /^node_modules$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
    }, {　　　　　　
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'　　　　
    }]
  },
  //devtool: 'source-map',
  plugins: plugins
};