import './style.css'
import {effect, map, track, trigger} from "./effect.ts";
import {computed} from "./computed.ts";
import {watch} from "./watch.ts";

interface Obj {
    ok: boolean,
    text: string,
    text2: string,
    foo: number,
    bar: number,
    count: number,
}

const data = {
    ok: false,
    text: 'hello',
    text2: 'hello2',
    foo: 1,
    bar: 2,
    count: 1,
    obj1: {
        count1: 1
    }
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

const sumRef = computed(() => obj.foo + obj.bar)

// effect(function sum(){
//     // 在该副作用函数中读取sumRes.value
//     console.log('sumRef', sumRef.value);
// })

watch(obj, (newValue) => {
    console.log('newValue', newValue);
})

setTimeout(() => {
    obj.obj1 = {
        count1: obj.obj1.count1 + 10
    }
}, 2000)

// setTimeout(() => {
//     console.log('map', map);
//     obj.count ++
// }, 2000)
