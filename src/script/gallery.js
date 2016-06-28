var React = require('react');
var ReactDom = require('react-dom');
var imagedata = require('../data/imageDatas.json');

//构建图片单个react component
var styleObj = {};
/*
*
*/
function random30(){
  return Math.random() > 0.5 ? '-' + random(0,30) : random(0,30) ;
}

var Imgfigure = React.createClass({
  handleClick:function(e){
    e.stopPropagation();
    e.preventDefault();
		if(this.props.data.isCenter){
        this.props.reverse(this.props.index);
		}else{
				this.props.center(this.props.index);
		}



	},
	render: function(){

		if(this.props.data.position){
			styleObj = this.props.data.position;
    }
    if (this.props.data.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.data.rotate + 'deg)';
      }.bind(this));
    }

    var imgClassName = 'figure';
    imgClassName += this.props.data.isreverse? ' reverse':'';
    return (
        <figure className = {imgClassName} style={styleObj} onClick={this.handleClick}>
            <img src={this.props.data.imageUrl} className="imgFigure"/>
            <figcaption className = "imgTitle">
              <p>{this.props.data.title}</p>
							<div className="img-back" onClick={this.handleClick}>
										<p>
											{this.props.data.desc}
										</p>
							</div>
            </figcaption>
        </figure>

      )

	}
});
function random(low,high){
  return Math.ceil(Math.random()*(high - low) + low);
}

//将图片的名字信息，转变为具体路径。
imagedata = (function(images){
  images.forEach(function(e,index){
  	e.imageUrl = require('../images/' + e.fileName);
    e.position = {
      left:0,
      top:0
    }
		e.isCenter= false;
		e.isreverse=false;
  	imagedata[index] = e;
  })
  return images;
})(imagedata)




var Gallery = React.createClass({
	//click 事件，用于图片点击
	center:function(e){
		return function(index){
			this.countPosition(index);
		}.bind(this)
  },
  reverse:function(){

    return function(e){

      var imgsInfo = this.state.imgsInfo;
      if(imgsInfo[e].isreverse){
        imgsInfo[e].isreverse = false;
      }else{
        imgsInfo[e].isreverse = true;
      }

      this.setState({
        imgsInfo:imgsInfo
      });
      console.log(imgsInfo[0])
    }.bind(this);
  },
  //用于存放每个区域放映图片的<<位置>>的范围。
  rangePosi:{

  },
  //存放所有图片的位置信息
	imgPosi:[],
	getInitialState:function(){
    var imgsInfo=[];
		imagedata.forEach(function(value,index){
			value.isCenter=false;
			value.isreverse=false;
      value.rotate = '0';
			imgsInfo.push(value);
		})
    return {
      imgsInfo: imagedata
    }
  },

  //存放图片dom节点，便于render
    imageDoms:[],

  //计算上，左，右，三个方向位置的范围
  componentDidMount:function(){
    var stageDOM = ReactDom.findDOMNode(this.refs.stage);
    var imgDom = ReactDom.findDOMNode(this.refs.image0);

     //舞台宽高
    var stageWidth = stageDOM.scrollWidth;
    var stageHeight = stageDOM.scrollHeight;
    //图片宽高
    var imgWidth = imgDom.scrollWidth;
    var imgHeight = imgDom.scrollHeight;

    //放映图片坐标
    this.rangePosi.centerLeft = Math.ceil((stageWidth - imgWidth) / 2);
    this.rangePosi.centerTop = Math.ceil((stageHeight - imgHeight) / 2);

		//左半部分x的范围
		this.rangePosi.leftX1 = - Math.ceil((imgWidth)/2);
		this.rangePosi.leftX2 =  (stageWidth/2 - imgWidth/2*3);
		//右半部分x的范围
		this.rangePosi.rightX1 = Math.ceil((stageWidth + imgWidth)/2);
    this.rangePosi.rightX2 = Math.ceil((stageWidth - imgWidth/2));

		//左右两半部分y的范围
		this.rangePosi.commenY1 = - Math.ceil(imgHeight / 2);
		this.rangePosi.commenY2 =  Math.ceil(stageHeight - imgHeight/2);

		//上面部分x范围
		this.rangePosi.topX1 = Math.ceil(stageWidth/2-imgWidth);
		this.rangePosi.topX2 = Math.ceil(stageWidth/2);
		//上面部分y范围
		this.rangePosi.topY1 = - Math.ceil(imgHeight/2);
		this.rangePosi.topY2 = Math.ceil(stageHeight/2 - imgHeight/2*3);
    this.countPosition(0);
  },

  render: function(){
		this.imageDoms = [];
		this.state.imgsInfo.forEach(function(e,index){

      this.imageDoms.push(<Imgfigure data={e} index={index} ref={'image' + index} center={this.center()}
      reverse={this.reverse()}/>);

    }.bind(this));
    return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {this.imageDoms}
            </section>
            <nav className="controller-nav">

            </nav>
        </section>
      )

  },
	countPosition: function(centerIndex){
		var imgInfo = {
			/*
         posi:{}, //记录图片位置信息,
				 center:true or false ,//是否为放映图片
			*/
		}
		var imgsInfo = this.state.imgsInfo;   //用来临时保存this.state.imgsInfo

		//每一次重新渲染，都将信息重置，以免状态叠加报错。
		imgsInfo.forEach(function(value,index){

			value.position = {
				left:0,
				top:0
			}
			value.isCenter = false;
			value.isreverse = false;
      value.rotate=0;

		});



		//为中间图片配置信息;
	  imgsInfo[centerIndex].position =  {
			left:this.rangePosi.centerLeft,
			top:this.rangePosi.centerTop
		}
		imgsInfo[centerIndex].isCenter=true;
		//将中间图片信息在数组中剔除出来

	  var imgCenter = imgsInfo.splice(centerIndex,1);
		//上面区域操作：
		var topSum = Math.floor(Math.random() * 2 );
		var topIndex = random(0,imgsInfo-1); //随机取得top 的 index
		var imgTop = imgsInfo.splice(topIndex,topSum);
    //imgTop 可能存在，也可能不存在，因为topSum也许为零，如果为零，下面的forEach不会运行
		//否则运行
		imgTop.forEach(function(value,index){
			value.position = {
				left:random(this.rangePosi.topX1,this.rangePosi.topX2),
				top:random(this.rangePosi.topY1,this.rangePosi.topY2)
			}
      value.rotate = random30();
		}.bind(this));

		//所有两面进行排布
		for(var i = 0 , j = imgsInfo.length; i < j ;i++){
			if(i < j/2){
				imgsInfo[i].position = {
					left:random(this.rangePosi.leftX1,this.rangePosi.leftX2),
					top:random(this.rangePosi.commenY1,this.rangePosi.commenY2)
				}
        imgsInfo[i].rotate = random30();
			}else{
				imgsInfo[i].position = {
					left:random(this.rangePosi.rightX1,this.rangePosi.rightX2),
					top:random(this.rangePosi.commenY1,this.rangePosi.commenY2)
				}
        imgsInfo[i].rotate = random30();
			}
		}
		//重新将上，中两部分图片插入数组中
		imgsInfo.splice(centerIndex,0,imgCenter[0]);
		if(imgTop.length){
				imgsInfo.splice(topIndex,0,imgTop[0]);
		}


		this.setState({
			imgsInfo:imgsInfo
		})
	}




});





module.exports = Gallery;
