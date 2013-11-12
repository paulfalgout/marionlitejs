var Marionlite = (function(global, $, _){
  "use strict";

    var Marionlite = function(options){
        this._modules = {};
        this._events = {};
        _.extend(this, options);
    };

    _.extend(Marionlite.prototype,{
        initialize: function(){
            this.trigger('initialize');
            _.each(this._modules, function(mod){
                //prevent reinitializing a module
                if(!mod.isInitialized && _.isFunction(mod.initialize)){
                    mod.initialize();
                    mod.isInitialized = true;
                }
            });
            return this;
        },
        start: function(){
            this.initialize();
            this.trigger('start');
            _.each(this._modules, function(mod){
                if(_.isFunction(mod.start)){
                    mod.start();
                }
            });
            return this;
        },
        on: function(name, callback, context){
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback: callback, context: context || this });
            return this;
        },
        off: function(name){
            delete this._events[name];
            return this;
        },
        trigger: function(name){
            var array = [];
            var args = array.slice.call(arguments, 1);
            var events = this._events[name];
            if (events) this._triggerEvents(events, args);
            return this;
        },
        //optimized trigger copied from backbone
        _triggerEvents: function(events, args) {
            var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
            switch (args.length) {
              case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
              case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
              case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
              case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
              default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
            }
        },
        module: function(module_name, define){
            this[module_name] = this[module_name] || {};
            
            this._modules[module_name] = this[module_name];
            
            define.call(this[module_name], this[module_name], this, $, _);
            
            return this;
        }
    });
    
    return Marionlite;
})(this, $, _);
