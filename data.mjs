export const articles=[
['c200','Cahier 200 pages simple','cahier'],['c100','Cahier 100 pages simple','cahier'],['p200','Cahier 200 pages plastique','cahier'],['p100','Cahier 100 pages plastique','cahier'],['tp','Cahier travaux pratiques, grand format plastique','cahier'],['blue','Stylo bleu','stylo'],['red','Stylo rouge','stylo'],['rame','Rame de papier','rame'],['color','Crayons de couleur','paquet'],['hb','Crayons HB / 2B','paquet'],['gum','Gomme','gomme'],['sharp','Taille-crayons','taille-crayon'],['reservoir','Taille-crayons avec réservoir','taille-crayon'],['double','Taille-crayons double entrée avec réservoir','taille-crayon'],['stick','Bâton de colle','bâton'],['tube','Tube de colle','tube'],['pot','Pot de colle','pot'],['rule','Règle de 30 cm','règle'],['slate','Ardoise','ardoise'],['case','Trousse','trousse'],['geo','Boîte de géométrie','boîte'],['view','Porte-vues','porte-vues'],['felt','Gros feutres Primo ou Giotto','paquet'],['bigcolor','Gros crayons de couleur','paquet'],['scissor','Ciseaux à bouts ronds','paire'],['clay','Pâte à modeler','paquet'],['cloth','Chiffon','chiffon'],['folder','Chemise de couleur','chemise']
].map(([id,name,unit])=>({id,name,unit,stock:0,threshold:null}));
const college={pot:1,rame:2,blue:10,red:5,geo:1,color:1,gum:2,rule:1,sharp:2};
const lycee={pot:1,rule:1,rame:2,blue:10,red:5,color:1,geo:1};
export const kits=[
{id:'tps',name:'Toute petite section',short:'TPS',level:'TPS',group:'Maternelle',variant:'Kit complet',price:350000,ready:0,recipe:{view:2,felt:2,bigcolor:2,scissor:2,clay:2,slate:1,rame:2,double:3,stick:4,cloth:1,folder:1}},
{id:'cp',name:'CP1 / CP2',short:'CP1 / CP2',level:'CP',group:'Primaire',variant:'Kit complet',price:160000,ready:0,recipe:{c200:2,c100:1,color:3,blue:4,red:2,hb:3,gum:4,case:1,reservoir:3,stick:5,rule:1,slate:1}},
{id:'ce',name:'CE1 / CE2',short:'CE1 / CE2',level:'CE',group:'Primaire',variant:'Cahiers plastiques',price:195000,ready:0,recipe:{tp:1,p200:4,hb:2,blue:4,red:2,color:2,gum:4,case:1,geo:1,double:3,tube:1,rule:1,slate:1}},
{id:'cm',name:'CM1 / CM2',short:'CM1 / CM2',level:'CM',group:'Primaire',variant:'Cahiers plastiques',price:195000,ready:0,recipe:{tp:3,p200:6,hb:2,blue:10,red:5,color:2,gum:4,case:1,geo:1,sharp:2,tube:2,rule:1,slate:1}},
{id:'college',name:'Collège · Simple',short:'Collège',level:'COL',group:'Secondaire',variant:'Cahiers simples',price:240000,ready:0,recipe:{c200:12,c100:5,...college}},
{id:'college-p',name:'Collège · Plastique',short:'Collège',level:'COL',group:'Secondaire',variant:'Cahiers plastiques',price:275000,ready:0,recipe:{p200:12,p100:5,...college}},
{id:'lycee',name:'Lycée · Simple',short:'Lycée',level:'LYC',group:'Secondaire',variant:'Cahiers simples',price:250000,ready:0,recipe:{c200:12,c100:10,...lycee}},
{id:'lycee-p',name:'Lycée · Plastique',short:'Lycée',level:'LYC',group:'Secondaire',variant:'Cahiers plastiques',price:285000,ready:0,recipe:{p200:12,p100:10,...lycee}}
];
export const kitById=id=>kits.find(k=>k.id===id);
export const articleById=id=>articles.find(a=>a.id===id);
export function capacity(state,kit){return Math.min(...Object.entries(kit.recipe).map(([id,q])=>Math.floor(state.raw[id]/q)));}
export function requirements(state,plan,packing={}){
 const totals={};for(const [id,q] of Object.entries(plan)){if(!Number.isSafeInteger(q)||q<0||q>10000)throw Error('Quantité de kits invalide.');const kit=kitById(id);if(!kit)throw Error('Kit inconnu.');for(const [a,n] of Object.entries(kit.recipe))totals[a]=(totals[a]||0)+n*q;}
 return Object.entries(totals).map(([id,need])=>{const missing=Math.max(0,need-state.raw[id]);const pack=packing[id]??1;if(!Number.isSafeInteger(pack)||pack<1||pack>10000)throw Error('Conditionnement invalide.');const order=Math.ceil(missing/pack)*pack;return {id,need,available:state.raw[id],missing,pack,order,surplus:order-missing};});
}
