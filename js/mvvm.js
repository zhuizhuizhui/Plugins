/*解析视图模板*/
class MVVM{
	constructor(options){
		this.$el=options.el;
		this.$data=options.data;
		//如果视图层存在
		if(this.$el){		
			//this方便调用该对象所有
			new compileTemplate(this.$el,this);
		}
	}
}