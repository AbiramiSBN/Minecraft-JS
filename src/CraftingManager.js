export class CraftingManager {
  constructor() {
    this.recipes = [
      { inputs:[
          ['wood','wood',null],
          ['wood','wood',null],
          [null ,null ,null]
        ],
        output:{item:'crafting_table',count:1}, shapeless:false
      },
      // add more…
    ];
  }

  findRecipe(grid) {
    return this.recipes.find(r => {
      if (r.shapeless) {
        const flat = grid.flat().filter(x=>x);
        const req  = r.inputs.flat().filter(x=>x);
        return flat.length===req.length && flat.every(i=>req.includes(i));
      } else {
        return JSON.stringify(grid) === JSON.stringify(r.inputs);
      }
    }) || null;
  }
}
