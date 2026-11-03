import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
const js=await readFile(new URL('../public/demos.js',import.meta.url),'utf8');
test('site provides landmarks and seven labelled demo cards',()=>{for(const pattern of [/<main\b/,/<nav\b/,/role="radiogroup" aria-label="浏览内容"/,/<fieldset/,/<legend/,/demos\.css/,/demos\.js/])assert.match(html,pattern);assert.equal((html.match(/class="ud-card"/g)||[]).length,7)});
test('controls expose roles and keyboard, pointer and cancellation paths',()=>{for(const pattern of [/role="switch"/,/role="tablist"/,/type="range"/,/type="checkbox"/,/role="tabpanel"/])assert.match(html,pattern);for(const pattern of [/pointerdown/,/pointermove/,/pointerup/,/pointercancel/,/lostpointercapture/,/ArrowRight/,/ArrowLeft/,/Home/,/End/])assert.match(js,pattern)});
test('self-hosted font and license are present',async()=>{const font=await readFile(new URL('../public/fonts/Raleway-VF.ttf',import.meta.url));const license=await readFile(new URL('../public/fonts/OFL.txt',import.meta.url),'utf8');assert.ok(font.length>100000);assert.match(license,/SIL OPEN FONT LICENSE Version 1\.1/)})
