/*!
 * Vue.js v1.0.0-beta.0
 * (c) 2018 mo
 * Released under the MIT License.
 */
 class Vue{
 	//主要是数据的初始化
 	constructor(options={}){
 		this.$el=document.querySelector(options.el);
 		let data=this.data=options.data;
 		Object.keys(data).forEach(key=>{
 			this.proxyData(key)
 		});
 		this.methods=options.methods;//事件方法
 		this.watcherTask={};//监听任务列表
 		this.observer(data);//初始化劫持监听所有数据
 		this.compile(this.$el);//解析dom
 	}
 	//数据代理
 	proxyData(key){
 		let that=this;
 		Object.defindProperty(that,key,{
 			configurable:false,
 			enumerable:true,
 			get(){
 				return that.data[key]
 			},
 			set(newVal){
 				that.data[key]=newVal
 			}
 		})
 	}
 	//劫持监听所有数据
 	observer(data){
 		let that=this;
 		Object.keys(data).forEach(key=>{
 			let value=data[key];
 			this.watcherTask[key]=[];
 			Object.defindProperty(data,key,{
 				configurable:false,
 				enumerable:true,
 				get(){
 					return value;
 				},
 				set(newVal){
 					if(newVal!===value){
 						value=newVal;
 						that.watcherTask[key].forEach(task=>{
 							task.update()
 						})
 					}
 				}
 			})
 		})
 	}
 	//解析dom
 	compile(el){
 		let nodes=el.childNodes;
 		for(let i=0,node;node=nodes[i];i++){
 			this.compile(node);
 			//v-model
 			if(node.hasAttribute('v-model')&&((node.tagName==='INPUT')||(node.tagName==='TEXTAREA'))){
 				node.addEventListener('input',()=>{
 					let attrVal=node.getAttribute('v-model');
 					this.watcherTask[attrVal].push(new Watcher(node,this.attrVal,'value'));
 					node.removeAttribute('v-model');
 					return ()=>{
 						this.data[key]=node.value
 					}
 				}())
 			}
 			//v-html
 			if(node.hasAttribute('v-html')){
 				let attrVal=node.getAttribute('v-html');
 				this.watcherTask[attrVal].push(new Watcher(node,this,attrVal,'innerHTML'));
 				node.removeAttribute('v-html');
 			}
 			this.compileText(node,'innerHTML')
 			if(node.hasAttribute('@click')){
 				let attrVal=node.getAttribute('@click');
 				node.removeAttribute('@click');
 				node.addEventListener('click',e=>{
 					this.methods[attrVal]&&this.methods[attrVal].bind(this)()
 				})
 			}
 		} 
 	}
 	//解析dom里处理纯双花括号的操作
 	compileText(){
 		let reg=/{{(.*)}}/g,
 			txt=node.textContent;
 		if(reg.test(txt)){
 			node.textContent=txt.replace(reg,(matched,value)=>{
 				let tpl=this.watcherTask[value]||[];
 				tpl.push(new Watcher(node,this,value,'innerHTML'));
 				return value.split('.').reduce((val,key)=>{
 					return this.data[key];
 				},this.$el);
 			})
 		}
 	}
 }

 //更新视图操作
 class Watcher{
 	constructor(el,vm,value,type){
 		this.el=el;
 		this.vm=vm;
 		this.value=value;
 		this.type=type;
 		this.update()
 	}	
 	update(){
 		this.el[this.type]=this.vm.data[this.value]
 	}
 }