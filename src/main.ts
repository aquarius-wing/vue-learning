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
    count: 1
}

const obj = new Proxy(data, {
    get(target: Obj, p: string | symbol, receiver: any): any {
        track(target, p)
        return target[p]
    },
    set(target: Obj, p: string | symbol, newValue: any, receiver: any): boolean {
        target[p] = newValue
        trigger(target, p)
        return newValue
    }
})



const dom = document.querySelector('#app') as HTMLElement

const dom2 = document.querySelector('#app2') as HTMLElement

const jobQueue = new Set<Function>()
const p = Promise.resolve()
let isFlushing = false
function flushJob() {
    if (isFlushing) return
    isFlushing = true
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally(() => {
        isFlushing = false
    })
}

effect(function fun1() {
    console.log(obj.count)
}, {
    schedule(fn: Function) {
        jobQueue.add(fn)
        flushJob()
    }
})

obj.count ++
obj.count ++

// setTimeout(() => {
//     console.log('map', map);
//     obj.count ++
// }, 2000)
