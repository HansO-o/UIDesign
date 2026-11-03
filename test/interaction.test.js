import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function fixture(){
 const options=Array.from({length:3},(_,i)=>({attrs:{'aria-checked':String(i===0)},listeners:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(k,f){this.listeners[k]=f},focus(){this.focused=true},contains(t){return t===this}}));
 const ind={style:{}}, classes=new Set();
 const root={clientWidth:306,listeners:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},querySelector:()=>ind,querySelectorAll:()=>options,addEventListener(k,f){this.listeners[k]=f},setPointerCapture(){}};
 const ctx={document:{querySelectorAll:s=>s==='.ud-segment'?[root]:[],getElementById:()=>null},window:{addEventListener(){}},setTimeout:fn=>fn()};
 vm.runInNewContext(readFileSync(new URL('../public/demos.js',import.meta.url),'utf8'),ctx);
 return {options,root,ind};
}
test('click and keyboard update selection and focus',()=>{const {options}=fixture();options[1].listeners.click({});assert.equal(options[1].attrs['aria-checked'],'true');options[1].listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(options[2].attrs['aria-checked'],'true');assert.equal(options[2].focused,true);options[2].listeners.keydown({key:'Home',preventDefault(){}});assert.equal(options[0].attrs['aria-checked'],'true')});
test('drag follows pointer and commits nearest segment',()=>{const {options,root,ind}=fixture();root.listeners.pointerdown({button:0,target:options[0],pointerId:1,clientX:10});root.listeners.pointermove({pointerId:1,clientX:155,preventDefault(){}});assert.equal(ind.style.transform,'translateX(145px)');root.listeners.pointerup({pointerId:1});assert.equal(options[1].attrs['aria-checked'],'true');assert.equal(ind.style.transform,'translateX(100px)')});
test('cancel and lost capture restore original selection',()=>{for(const event of ['pointercancel','lostpointercapture']){const {options,root,ind}=fixture();root.listeners.pointerdown({button:0,target:options[0],pointerId:1,clientX:10});root.listeners.pointermove({pointerId:1,clientX:205,preventDefault(){}});root.listeners[event]({pointerId:1});assert.equal(options[0].attrs['aria-checked'],'true');assert.equal(ind.style.transform,'translateX(0px)')}});
test('tabs switch panels and support keyboard navigation',()=>{
 const panels=Array.from({length:3},()=>({hidden:false}));
 const tabs=Array.from({length:3},(_,i)=>({attrs:{'aria-controls':String(i)},listeners:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(k,f){this.listeners[k]=f},focus(){this.focused=true}}));
 const root={querySelectorAll:()=>tabs};
 const ctx={document:{querySelectorAll:s=>s==='.ud-tabs'?[root]:[],getElementById:id=>panels[Number(id)]},window:{addEventListener(){}},setTimeout:fn=>fn()};
 vm.runInNewContext(readFileSync(new URL('../public/demos.js',import.meta.url),'utf8'),ctx);
 tabs[0].listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(tabs[1].attrs['aria-selected'],'true');assert.equal(panels[0].hidden,true);assert.equal(panels[1].hidden,false);assert.equal(tabs[1].focused,true);
});
test('stepper enforces lower and upper bounds',()=>{
 const output={textContent:''};const buttons=[-1,1].map(n=>({dataset:{udStep:String(n)},listeners:{},addEventListener(k,f){this.listeners[k]=f}}));const root={querySelector:()=>output,querySelectorAll:()=>buttons};
 const ctx={document:{querySelectorAll:s=>s==='.ud-stepper'?[root]:[],getElementById:()=>null},window:{addEventListener(){}},setTimeout:fn=>fn()};
 vm.runInNewContext(readFileSync(new URL('../public/demos.js',import.meta.url),'utf8'),ctx);assert.equal(buttons[0].disabled,true);for(let i=0;i<12;i++)buttons[1].listeners.click();assert.equal(output.textContent,10);assert.equal(buttons[1].disabled,true);buttons[0].listeners.click();assert.equal(output.textContent,9);
});
