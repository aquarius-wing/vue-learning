import {effect} from "./effect.ts";


export function watch(source: object, callback) {
    effect(() => traverse(source), {
        schedule(fn){
            const newValue = fn()
            callback(newValue)
        }
    })
}

function traverse(obj: object) {
    if (typeof obj !== 'object' || obj === null) return
    for(const key in obj) {
        traverse(obj[key])
    }
    return obj
}
