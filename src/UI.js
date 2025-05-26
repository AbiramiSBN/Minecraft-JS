export class UI {
  constructor(blockRegistry, craftingManager) {
    this.el = document.getElementById('ui');
    this.blockRegistry = blockRegistry;
    this.crafting = craftingManager;
  }

  update() {
    // e.g. show selected block
    this.el.innerText = 'Use mouse to place/destroy blocks';
  }
}
