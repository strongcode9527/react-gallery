var webpack = require('webpack');
module.exports={
	entry:['./src/app.js'],
	output: {
		publicPath: '/bin/',
		filename:'app.bundle.js'
	},
	module: {
	  loaders: [
	    
	       {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        loader: 'babel',
	        query:
	        {
	        	presets:['react']
	        }
	      },
	     {
         test: /\.css$/,
         loader: 'style-loader!css-loader'
       }, {
         test: /\.scss$/,
         loaders: 'style-loader!css-loader!sass-loader'
       },{
		      test: /\.json$/,
		      loader: 'json-loader'
		    }, {
		      test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
		      loader: 'url-loader?limit=8192'
		    }


	  ]
	},
	 plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

};
