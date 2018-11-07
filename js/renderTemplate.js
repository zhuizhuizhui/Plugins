/*
*解析模板el
	class renderTemplate 参数VUE
	判断el是否为节点或元素
		true:创建虚拟dom渲染模板
				解析元素时
					判断是否包含指令
					判断是否为表单元素
				解析内容时
				    判断是否为{{info}}模板
				    判断是否为{{1+2*3}}模板
**/
let updata={
	'v-text':function(node,val,data){
		node.textContent=data[val]
	},
	'v-mode':function(node,val,data){
		//判断是否为表单元素
		if(!(node.tagName==='INPUT'))
		throw new Error('该元素不是表单元素')
		node.value=data[val]
		node.addEventListener('input',()=>{
			data[val]=node.value;			
		})
	}
}
class renderTemplate{
	constructor(vm){
		let tmp_el=vm.$el;
		this.el=this.isElementNode(tmp_el)?tmp_el:document.querySelector(tmp_el);
		this.vm=vm;	
		if(this.el){
			let fregment=this.nodeFregment(this.el)				
			this.compile(fregment);
			this.el.appendChild(fregment)
		}
	}
	isElementNode(node){
		return node.nodeType===1;
	}
	isTextNode(node){
		return node.nodeType===3
	}	
	isDirective(str){
		return str.includes('v-')
	}
	nodeFregment(node){
		let container=document.createDocumentFragment(),
			child;
		while(child=node.firstChild){
			container.appendChild(child)
		}
		return container;
	}
	compile(container){
		let nodelist=container.childNodes,
			that=this,
			childs=Array.from(nodelist);
		childs.forEach(node=>{			
		    if(that.isElementNode(node)){
				that.compileElement(node)
			}else if(that.isTextNode(node)){
				that.compileText(node)
			}
		})
	}
	compileElement(node){
		let that=this,
			attrVals=Array.from(node.attributes);
		attrVals.forEach(item=>{			
			let type=item.name;
			if(that.isDirective(type)){
				updata[type](node,item.value,that.vm.$data)
			}
		})
	}
	compileText(node){			
		if(/{{(.+)}}/.test(node.textContent)){
			let val=RegExp.$1;
			let reg=/[a-zA-Z]/;				
			reg.test(val)
			   ?node.textContent=this.vm.$data[val]
			   :node.textContent=eval(val)			
		}
	}
}