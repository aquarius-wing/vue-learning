import './style.css'
import {effect, map, track, trigger} from "./effect.ts";

interface Obj {
    ok: boolean,
    text: string,
    text2: string
}

const data = {
    ok: false,
    text: 'hello',
    text2: 'hello2'
}

const obj = new Proxy(data, {
    get(target: Obj, p: string | symbol, receiver: any): any {
        track(target, p)
        return target[p]
    },
    set(target: Obj, p: string | symbol, newValue: any, receiver: any): boolean {
        target[p] = newValue
        trigger(target, p)
    }
})



const dom = document.querySelector('#app') as HTMLElement

const dom2 = document.querySelector('#app2') as HTMLElement


effect(function fun1() {
    console.log('function1 执行')
    effect(function fun2() {
        console.log('function2 执行')
        dom2.innerText = obj.text2
    })
    dom.innerText = obj.text
})


setTimeout(() => {
    console.log('map', map);
    obj.text = 'world'

}, 2000)
