
type Function = () => void

type ObjKeyMap = Map<string, Set<Function>>

type ObjMap = WeakMap<object, ObjKeyMap>

type OptionsType = {
    schedule?: (func: Function) => void
    lazy?: boolean
}
export const map = new WeakMap() as ObjMap

let activeEffect: Function | undefined
const activeStack: Function[] = []
export function effect(fn: () => void, options: OptionsType = {}) {

    // 这里封装一下就相当于是把fn的执行前后和activeEffect进行绑定
    const proxyFn = () => {
        activeEffect = proxyFn
        activeStack.push(proxyFn)
        const value = fn()
        activeStack.pop()
        activeEffect = activeStack[activeStack.length - 1]
        return value
    }

    // 只有这里添加了options才能在trigger函数中拿到options
    proxyFn.options = options

    if (!options.lazy){
        proxyFn()
    }
    if (options.lazy) {
        return proxyFn
    }
}

export function track(obj: object, p: string) {
    let functionMap = map.get(obj)
    if (!functionMap) {
        functionMap = new Map() as ObjKeyMap
        map.set(obj, functionMap)
    }
    let functionSet = functionMap.get(p)
    if (!functionSet) {
        functionSet = new Set<Function>()
        functionMap.set(p, functionSet)
    }
    if (activeEffect) {
        functionSet.add(activeEffect)
    }
}

export function trigger(obj: object, p: string | symbol) {
    const functionMap = map.get(obj)
    if (!functionMap) {
        return
    }
    const functionSet = functionMap.get(p)
    if (functionSet) {
        functionSet.forEach((f) => {
            if (f !== activeEffect) {
                if (f.options.schedule) {
                    f.options.schedule(f)
                } else {
                    f()
                }
            }
        })
    }
}
