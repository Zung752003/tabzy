function Tabzy(selector, options = {}){
    this.container = document.querySelector(selector);
    if(!this.container){
        console.error(`Tabzy: No container found for selector '${selector}'`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if(!this.tabs.length){
        console.error(`Tabzy: No tab found inside container`);
        return;
    }

    this.panels = this.getPanels();

    if(this.tabs.length !== this.panels.length)return;

    this._cleanRegex = /[^a-zA-Z0-9]/g;
    this.originHTML = this.container.innerHTML;
    this.paramKey = selector.replace(this._cleanRegex, "");

    this.opt = Object.assign({
        activeClassName: "tabzy--active",
        remember: false,
        onChange: null,
    },options)

    
    this._init();
}

Tabzy.prototype.getPanels = function(){
    return this.panels = this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));
        if(!panel){
            console.error(`Tabzy: No found panel for tab`)
        }
        return panel;
    }).filter(Boolean);
}

Tabzy.prototype._init = function(){
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.paramKey);

    const tab = (this.opt.remember && tabSelector && this.tabs.find(tab => tab.getAttribute("href").replace(this._cleanRegex, "") === tabSelector)) || this.tabs[0];
    
    this._activeTab(tab, false, false);

    this.currentTab = tab;

    this.tabs.forEach(tab => {
        tab.onclick = e => {
            e.preventDefault();
            this._tryActivateTab(tab)
        }
    });

}

Tabzy.prototype._activeTab = function(tab, triggerOnChange = true, updateURL = this.opt.remember){
    this.tabs.forEach(tab => tab.closest("li").classList.remove(this.opt.activeClassName));
    tab.closest("li").classList.add(this.opt.activeClassName);
    
    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if(updateURL){
        const params = new URLSearchParams(location.search)
        const paramValue = tab.getAttribute("href").replace(this._cleanRegex, "");
        params.set(this.paramKey, paramValue)
        history.replaceState(null, null, `?${params}`);
    }

    if(triggerOnChange && typeof this.opt.onChange === 'function'){
        this.opt.onChange({
            tab,
            panel: panelActive,
        })
    }
}

Tabzy.prototype._tryActivateTab = function(tab){
    if(this.currentTab !== tab){
        this.currentTab = tab;
        this._activeTab(tab);
    }
}

Tabzy.prototype.switch = function(input){
    const tab = typeof input === 'string' ? this.tabs.find(tab => tab.getAttribute("href") === input) : this.tabs.includes(input) ? input : null
    // if(typeof input === 'string'){
    //     tabToActive = this.tabs.find(tab => tab.getAttribute("href") === input);
    //     if(!tabToActive){
    //         console.error(`Tabzy: No tab found with ID '${input}'`);
    //         return;
    //     }
    // }else if(this.tabs.includes(input)){
    //     tabToActive = input
    // } 

    if(!tab){
        console.error(`Tabzy: invalid input '${input}'`)
    }

    this._tryActivateTab(tab);
}

Tabzy.prototype.destroy = function(){
    this.container.innerHTML = this.originHTML;

    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.tabs = null;
    this.panels = null;
}