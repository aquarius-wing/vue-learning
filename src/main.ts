import './style.css'



function createRenderer() {
    function render(vNode: VNodeType, container: HTMLElement) {
        const oldVNode = container._vNode
        patch(oldVNode, vNode, container)
    }

    return {
        render
    }
}

let unmountCount = 0

function unmount(vNode: VNodeType) {
    unmountCount ++
    const parent = vNode.el.parentNode
    if (parent) {
        parent.removeChild(vNode.el)
    }
}

function unmountTextNode(vNode: VNodeType) {
    unmountCount ++
    vNode.el!.innerText = ''
}


function patch(oldVNode: VNodeType | undefined, newVNode: VNodeType, container: HTMLElement) {
    if (oldVNode && oldVNode.type !== newVNode.type) {
        // 无法复用，则删除
        unmount(oldVNode)
        oldVNode = undefined
    }
    const newType = newVNode
    if (oldVNode === undefined || oldVNode === null) {
        mountElement(newVNode, container)
    } else {
        patchElement(oldVNode, newVNode)
    }

}

function mountElement(vNode: VNodeType, container: HTMLElement) {
    const dom = document.createElement(vNode.type)
    vNode.el = dom
    // 只有这里赋值了，才能在上面的render里面拿到
    container._vNode = vNode
    container.insertBefore(dom, null)
    if (Array.isArray(vNode.children)) {
        for (const child of vNode.children) {
            patch(null, child, dom)
        }
    }
    if (typeof vNode.children === 'string') {
        dom.innerText = vNode.children
    }
}

function patchElement(oldVNode: VNodeType, newVNode: VNodeType) {
    const el = newVNode.el = oldVNode.el
    if (el) {
        patchChildren(oldVNode, newVNode, el)
    }
}

function findReuseOldVNode(newChild: VNodeType, children: VNodeType[]){
    for (const child of children) {
        if (child.type === newChild.type) {
            return child
        }
    }
    return undefined
}

function patchChildren(oldVNode: VNodeType, newVNode: VNodeType, container: HTMLElement) {
    // 如果都是字符串
    if (typeof oldVNode.children === 'string' && typeof newVNode.children === 'string') {
        if (oldVNode.children !== newVNode.children) {
            container.innerText = newVNode.children
        }
    }

    // 如果一个是字符串，一个是其他的
    if (typeof oldVNode.children === 'string' && Array.isArray(newVNode.children)) {
        oldVNode.el!.innerText = ''
        for (const newVNodeChildren of newVNode.children) {
            mountElement(newVNodeChildren, newVNode.el!)
        }
    }

    // 如果都是children
    if (Array.isArray(oldVNode.children) && Array.isArray(newVNode.children)) {
        for (let i = 0; i < newVNode.children.length; i++) {
            const newChild = newVNode.children[i]
            const oldChild = findReuseOldVNode(newChild, oldVNode.children)
            patch(oldChild, newChild, newVNode.el!)
        }
    }

}






const renderer = createRenderer()

type TAG = string

type VNodeType = {
    type: TAG
    children: VNodeType[] | string
    key?: number
    el?: HTMLElement
}

/*const vNode1 = {
    type: 'div',
    children: '1'
}

renderer.render(vNode1, document.querySelector('#app')!)

const vNode2 = {
    type: 'div',
    children: [
        { type: 'p', children: '2' }
    ]
}

setTimeout(() => {
    renderer.render(vNode2, document.querySelector('#app')!)
}, 2000)*/


const vNode1 = {
    type: 'div',
    children: [
        { type: 'p', children: '1' },
        { type: 'div', children: '2' },
    ]
}

renderer.render(vNode1, document.querySelector('#app')!)

const vNode2 = {
    type: 'div',
    children: [
        { type: 'div', children: '2' },
        { type: 'p', children: '3' }
    ]
}

setTimeout(() => {
    renderer.render(vNode2, document.querySelector('#app')!)
    console.log('unmountCount', unmountCount);
}, 2000)

