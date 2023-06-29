import {effect} from "./effect.ts";

export type Ref = {
    value: any
}

export function computed(getter: () => any): Ref {

    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        schedule(fn: Function) {
            // 为什么这里不需要手动执行一次fn？
            // 因为这里设置了dirty，然后下面在获取值的时候才会执行fn
            // 这才符合lazy的设计
            console.log('dirty set true')
            dirty = true
        }
    }) as () => any

    return {
        get value() {
            console.log('dirty', dirty)
            if (dirty) {
                dirty = false
                value = effectFn()
                return value
            }
            return value
        }
    }
}
