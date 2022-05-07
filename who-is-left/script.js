/**
 * @requires Swal
 */

import { CountsStorage } from "./counts_storage.js"

const data = new CountsStorage()


/** @type {HTMLButtonElement} */
const import_button = document.querySelector('button#import')
/** @type {HTMLButtonElement} */
const reset_button = document.querySelector('button#reset')
/** @type {HTMLUListElement} */
const counts_el = document.querySelector('ul#counts')


/**
 * 
 * @param {string} name 
 * @param {number} count 
 */
function generate_li(name, count) {
    const li = document.createElement('li')
    const button = document.createElement('button')
    li.appendChild(button)

    button.ariaLabel = `记下${name}`
    button.dataset.name = name
    button.dataset.count = count
    button.innerHTML = [
        `<span class='name'>${name}</span>`,
        `<span class='count'>${count}</span>`,
    ].join('')

    return li
}
/**
 * @param {HTMLLIElement} li 
 */
function redraw_li(li) {
    /** @type {HTMLButtonElement} */
    const button = li.querySelector(':scope > button')

    const name = button.dataset.name
    const count = data.counts.get(name)

    button.dataset.count = count
    button.querySelector(':scope > .count').textContent = count
}

/**
 * @param {CountsStorage} data 
 * @param {HTMLUListElement} counts_el 
 */
function draw_all(data, counts_el) {
    counts_el.innerHTML = ''

    for (const [name, count] of data.counts.entries()) {
        const li = generate_li(name, count)
        counts_el.appendChild(li)
    }
}


draw_all(data, counts_el)

import_button.addEventListener('click', async () => {
    /** @type {{value: string}} */
    const { value: names, isConfirmed } = await Swal.fire({
        input: 'textarea',
        inputLabel: '全集',
        inputPlaceholder: '请用“,”或换行分隔',
        inputAttributes: {
            'aria-label': '请在此输入全集'
        },
        showCancelButton: true,
    })

    if (isConfirmed) {
        data.reset(names.split(/[\n,]+/))
        draw_all(data, counts_el)
    }
})
reset_button.addEventListener('click', () => {
    data.reset()
    counts_el.childNodes.forEach(redraw_li)
})

counts_el.addEventListener('click', ({ target }) => {
    if (!target.matches('li, li *')) {
        return
    }

    /** @type {HTMLLIElement} */
    const li = target.closest('li')
    data.increment(li.querySelector(':scope > button').dataset.name)
    redraw_li(li)
})
