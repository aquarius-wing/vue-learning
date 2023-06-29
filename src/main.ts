import './style.css'
import {effect, map, track, trigger} from "./effect.ts";

interface Obj {
    ok: boolean,
    text: string,
    text2: string,
    count: number
}

const data = {
    ok: false,
    text: 'hello',
    text2: 'hello2',
    count: 0
}

const obj = new Proxy(data, {
    get(target: Obj, p: string | symbol, receiver: any): any {
        console.log('track')
        track(target, p)
        return target[p]
    },
    set(target: Obj, p: string | symbol, newValue: any, receiver: any): boolean {
        target[p] = newValue
        console.log('trigger')
        trigger(target, p)
        return newValue
    }
})



const dom = document.querySelector('#app') as HTMLElement

const dom2 = document.querySelector('#app2') as HTMLElement


effect(function fun1() {
    console.log('function1 执行')
    obj.count ++
})


// setTimeout(() => {
//     console.log('map', map);
//     obj.count ++
// }, 2000)
