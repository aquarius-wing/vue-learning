
type Function = () => void

type ObjKeyMap = Map<string, Set<Function>>

type ObjMap = WeakMap<object, ObjKeyMap>
export const map = new WeakMap() as ObjMap

let activeEffect: Function | undefined
export function effect(fn: () => void) {
    activeEffect = fn
    fn()
    activeEffect = undefined
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
        functionSet.forEach((f) => f())
    }
}
