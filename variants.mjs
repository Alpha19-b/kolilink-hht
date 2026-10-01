// swapSource is supplied only by the migrated server after validating both recipes.
export function saleAvailability(state,kit,lookup){
 const ready=state.ready[kit.id]||0,source=lookup(state.swapSources?.[kit.id]);
 if(!kit.active)return {ready,exchange:0,total:0,source:null};
 if(!source?.active)return {ready,exchange:0,total:ready,source:null};
 let exchange=state.ready[source.id]||0;
 for(const [id,n] of Object.entries(kit.recipe)){
   const required=n-(source.recipe[id]||0);
   if(required>0)exchange=Math.min(exchange,Math.floor((state.raw[id]||0)/required));
 }
 return {ready,exchange,total:ready+exchange,source:source.id};
}
export function salePlan(state,kit,quantity,lookup){
 const availability=saleAvailability(state,kit,lookup),swapQty=Math.max(0,quantity-availability.ready);
 const changes={};
 if(swapQty&&availability.source){
   const source=lookup(availability.source);
   for(const id of new Set([...Object.keys(kit.recipe),...Object.keys(source.recipe)])){
     const delta=((source.recipe[id]||0)-(kit.recipe[id]||0))*swapQty;
     if(delta)changes[id]=delta;
   }
 }
 return {qty:quantity,swapQty,swapFrom:swapQty?availability.source:null,changes};
}
