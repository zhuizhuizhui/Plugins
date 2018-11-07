/*创建VUE构造器
	class VUE参数el,data
	如果视图层el存在，渲染模板
*/
class Vue{
	constructor(options){
		this.$el=options.el;
		this.$data=options.data;
		if(this.$el)
			new renderTemplate(this)
	}
}