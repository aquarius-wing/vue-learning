
type Function = () => void

type ObjKeyMap = Map<string, Set<Function>>

type ObjMap = WeakMap<object, ObjKeyMap>
export const map = new WeakMap() as ObjMap

const activeEffect: Function[] = []
export function effect(fn: () => void) {
    activeEffect.push(fn)
    fn()
    activeEffect.pop()
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
    if (activeEffect.length > 0) {
        functionSet.add(activeEffect[activeEffect.length - 1])
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
            if (activeEffect.length === 0
                || (activeEffect.length > 0
                    && f !== activeEffect[activeEffect.length - 1]
                )
            ) {
                console.log('f', f);
                console.log('activeEffect[', activeEffect);
                f()
            }
        })
    }
}
