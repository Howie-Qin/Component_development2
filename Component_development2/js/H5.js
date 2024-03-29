// 内容管理对象
var jdata = [];
var H5 =function(){
   this.id = ('h5_'+Math.random()).replace('.','_');
   this.el = $('<div class="h5" id="'+this.id+'">').hide();
   this.page=[];
   $('body').append(this.el );
   
   // 新增一个页
   /**
    * [addPage description]
    * @param {[type]} name 组件的名称，会加入到ClassName中
    * @param {[type]} text 业内的默认文本
    * @return {H5} H5对象，可以重复使用H5对象支持的方法
    */
   this.addPage =function(name, text){
        jdata.push({isPage:true,name:name,text:text});
        var page = $('<div class="h5_page section">');

        if (name != undefined) {
        page.addClass('h5_page_'+name);
        }
        if (text !=undefined) {
            page.text(text);
        }
        //注意此刻的this所指向的对象
        this.el.append(page);s
        this.page.push( page );
        
        if(typeof this.whenAddPage === 'function'){
          this.whenAddPage();
        }
        //返回当前对象，便于重新使用addPage方法
        return this;
   }
   // 新增一个组件
   this.addComponent =function(name,cfg){
        jdata.push({isPage:false,name:name,cfg:cfg});
        var cfg = cfg || {};
        //cfg没有传参，或者没有type，默认给一个type
        cfg = $.extend({
           type:"base"
        },cfg);

      var component;//定义一个变量存储 组件元素
      var page = this.page.slice(-1)[0];

      switch(cfg.type){
           //如果是一个图文组件
           case 'base': 
                  component = new H5ComponentBase(name,cfg);
                  break;
           case 'polyline': 
                  component = new H5ComponentPolyline(name,cfg);
                  break;  
           case 'pie': 
                  component = new H5ComponentPie(name,cfg);
                  break; 
           case 'bar': 
                  component = new H5ComponentBar(name,cfg);
                  break; 
          case 'bar_v': 
                  component = new H5ComponentBar_v(name,cfg);
                  break; 
           case 'radar': 
                  component = new H5ComponentRadar(name,cfg);
                  break; 
           case 'ring': 
                  component = new H5ComponentRing(name,cfg);
                  break; 
           case 'point': 
                  component = new H5ComponentPoint(name,cfg);
                  break; 
                  // default;
      }
     page.append(component);

        return this;
   }
    
    // H5对象初始化呈现
    this.loader =function(firstPage){
      this.el.fullpage({
         
            onLeave:function(index,nextIndex,direction){
                        $(this).find('.h5_component').trigger('onLeave');
                    },
            afterLoad:function( anchorLink ,index){
                         $(this).find('.h5_component').trigger('onLoad');
                    }

      });
      //刚刷新的时候就触发onLoad
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();

        if (firstPage) {
           $.fn.fullpage.moveTo(firstPage);//直接加载到对应页
        }
    }
   
   this.loader = typeof H5_loading == 'function'?H5_loading:this.loader;
   return this;
   
}