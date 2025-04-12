function Tabzy(selector, options = {}){
    this.container = document.querySelector(selector);
    if(!this.container){
        console.error(`Tabzy: No container found for selector ''${selector}`);
        return;
    };

    this.tabs = Array.from(document.querySelectorAll("li a"));
    if(!this.tabs.length){
        console.error(`Tabzy: No tab found inside container`);
        return;
    }
    
    this.panels = this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));
        if(!panel){
            console.error(`Tabzy: No panel found for tab`);
        }
        return panel;
    }).filter(Boolean);

    if(this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign({
        remember: false,
    }, options)

    this.originHTML = this.container.innerHTML;

    this._init();
}

Tabzy.prototype._init = function(){
    // if(hash){
    //     tabActive = this.tabs.find(tab => tab.getAttribute("href") === hash) || this.tabs[0];
    // }
    const hash = location.hash
    const tab = (this.opt.remember && hash && this.tabs.find(tab => tab.getAttribute("href") === hash)) || this.tabs[0]

    this._activeTab(tab);
    

    this.tabs.forEach(tab => {
        tab.onclick = e => this._handleTabClick(e, tab)
    })
}

Tabzy.prototype._handleTabClick = function(e, tab){
    e.preventDefault();
    this._activeTab(tab)
}

Tabzy.prototype._activeTab = function(tab){
    this.tabs.forEach(tab => tab.closest('li').classList.remove("tabzy--active"));
    tab.closest("li").classList.add("tabzy--active");
    
    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if(this.opt.remember){
        history.replaceState(null, null, tab.getAttribute("href"))
    }
}

Tabzy.prototype.switch = function(input){
    let tabToActive = null;
    if(typeof input === 'string'){
        tabToActive = this.tabs.find(tab => tab.getAttribute("href") === input)
        if(!tabToActive){
            console.error(`Tabzy: No panel found with ID '${input}'`)
            return;
        }
    } else if(this.tabs.includes(input)){
        tabToActive = input;
    }

    this._activeTab(tabToActive)
}

Tabzy.prototype.destroy = function(){
    this.container.innerHTML = this.originHTML;

    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.panels = null;
    this.tabs = null;
}