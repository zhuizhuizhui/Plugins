/*
	*解析指令
	*解析文本
	*解析表达式
	*
	*
	*
	*
	*
	*
	*
	*
*/
let CompileUtils={
		text(node,vm,expr){
			node.textContent=vm.$data[expr]
		},
		model(node,vm,expr){
			node.value=vm.$data[expr];
			node.addEventListener('input',(e)=>{
				let newVal=node.value;
				vm.$data[expr]=newVal
			})
		}
	};
class compileTemplate{
	constructor(el,vm){
		this.el=this.isElementNode(el)?el:document.querySelector(el);
		this.vm=vm;
		if(this.el){
			let fregment=this.nodefregment(this.el);
			this.compile(fregment);
			this.el.appendChild(fregment);
		}
	}
	//元素节点
	isElementNode(node){
		return node.nodeType===1;
	}
	//文本节点
	isTextNode(node){
		return node.nodeType===3;
	}
	//指令
	isDirective(str){
		return str.includes('v-');
	}
	//创建dom块
	nodefregment(node){
		let fragment=document.createDocumentFragment(),
			child;		
		while(child=node.firstChild){
			fragment.appendChild(child);
		}
		return fragment;
	}
	//编译模板
	compile(parent){
		let nodelist=parent.childNodes,
			that=this,
			childs=Array.from(nodelist);
			childs.forEach(node=>{
				//判断元素节点 文本节点
				if(that.isElementNode(node)){				
					that.compileElement(node)
				}else if(that.isTextNode(node)){
						let content=node.textContent,
							reg=/{{(.+)}}/;								
							reg.test(content)&&that.compileText(node,that.vm,RegExp.$1);
					}
			})
	}
	compileElement(node){		
		let that=this;
		//该元素是否具有特定属性(指令)
		//    获取该元素所有属性并遍历判断
		let attrVals=Array.from(node.attributes);
			attrVals.forEach(attr=>{
				let attrName=attr.name;
				if(that.isDirective(attrName)){					
					let type=attrName.slice(2),
						expr=attr.value;
					CompileUtils[type](node,that.vm,expr)
				}
			})
	}
	compileText(node,vm,val){
		let reg=/[a-zA-Z]/;
		reg.test(val)?
			node.textContent=vm.$data[val]:
			node.textContent=eval(val);		
	}		
}