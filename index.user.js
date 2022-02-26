// ==UserScript==
// @name         testco-ie-tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhance testco cart
// @author       aldy12345@gmail.com
// @match        https://www.tesco.ie/groceries/en-IE/trolley*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @updateURL    https://raw.githubusercontent.com/aldy120/testco-ie-tools/master/index.user.js
// @downloadURL  https://raw.githubusercontent.com/aldy120/testco-ie-tools/master/index.user.js
// @run-at       document-body
// ==/UserScript==

(function () {
    function test() {
        console.assert(typeof getCsrfToken() === 'string')

        const cart1 = {
            "items": [
                {
                    "id": "268290106",
                    "newValue": 30,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                },
                {
                    "id": "298040830",
                    "newValue": 4,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                }
            ],
            "returnUrl": "/groceries/en-IE/trolley"
        }

        const cart2 = {
            "items": [
                {
                    "id": "257231200",
                    "newValue": 1,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                },
                {
                    "id": "298040830",
                    "newValue": 4,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                }
            ],
            "returnUrl": "/groceries/en-IE/trolley"
        }

        const wrongCart1 = {
            "items": [
                {
                    "id": "268290106",
                    "newValue": 30,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                },
                {
                    "id": "298040830",
                    "newValue": 5,
                    "newUnitChoice": "pcs",
                    "substitutionOption": "FindSuitableAlternative"
                }
            ],
            "returnUrl": "/groceries/en-IE/trolley"
        }


        const itemList1 = cart1.items
        const itemList2 = cart2.items
        const wrongItemList1 = wrongCart1.items
        console.assert(JSON.stringify(createNewItemLists(itemList1, itemList2)) === '[{"id":"268290106","newValue":30,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"},{"id":"298040830","newValue":8,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"}]')
        console.assert(JSON.stringify(createNewItemLists(wrongItemList1, itemList2)) !== '[{"id":"268290106","newValue":30,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"},{"id":"298040830","newValue":8,"newUnitChoice":"pcs","substitutionOption":"FindSuitableAlternative"}]')
    }

    function getCsrfToken() {
        return document.querySelector('#data-attributes').dataset.csrfToken
    }

    async function putItems(payload) {
        const stream = fetch("https://www.tesco.ie/groceries/en-IE/trolley/items?_method=PUT", {
            "headers": {
                "accept": "application/json",
                "content-type": "application/json",
                "x-csrf-token": getCsrfToken(),
            },
            "referrer": "https://www.tesco.ie/groceries/en-IE/shop/fresh-food/fresh-fruit/apples-pears-and-rhubarb",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(payload),
            "method": "PUT",
            "mode": "cors",
            "credentials": "include"
        });

        cart = await stream.then(r => r.json())

        const items = cart.items.map(x => ({
            id: x.product.id,
            newValue: x.quantity,
            newUnitChoice: x.customerUnitChoice,
            substitutionOption: x.substitutionOption,
            title: x.product.title
        }))

        if (items.some(x => x.newUnitChoice !== 'pcs')) {
            throw new Error('There are some items with non-supported unit');
        }

        return items
    }

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    var toolsNode = htmlToElement('<div><div class="trolley-order-summary--container"><div class="trolley-order-summary -trolley"><h2 class="trolley-order-summary--large-header">Import from JSON</h2><div class="trolley-surcharge-warning"><div class="trolley-surcharge-warning--link"><div><textarea id="import-area-tesco-tools-monkey" placeholder="json to be import"></textarea></div></div></div><div class="order-summary--info"></div><div class="order-summary--rows"><div><div class="overlay-spinner--overlay" data-auto="overlay-spinner"></div></div><div class="accordion trolley-order-summary--accordion" data-auto="accordion"><button                        class="accordion--button" aria-controls="accordion-order-summary" aria-expanded="false"                        type="button"><span class="accordion--title">View more</span><span                            class="accordion--icon icon-chevron-down-small-blue"></span></button><div class="accordion--content" id="accordion-order-summary"><div></div></div></div></div></div><div class="trolley-order-summary--button hidden-small-medium -trolley"><div data-auto="continue-checkout-button" class="trolley-order-summary--button"><div class="button-with-feedback undefined"><a id="import-btn-tesco-tools-monkey" href="#" class="button button-primary">Import Bucket</a><div class="spinner hidden"></div></div></div></div></div><div class="trolley-order-summary--container"><div class="trolley-order-summary -trolley"><h2 class="trolley-order-summary--large-header">Export to JSON</h2><div class="trolley-surcharge-warning"><div class="trolley-surcharge-warning--link"><div><span id="export-area-tesco-tools-monkey">json to be export</span></div></div></div><div class="order-summary--info"></div><div class="order-summary--rows"><div><div class="overlay-spinner--overlay" data-auto="overlay-spinner"></div></div><div class="accordion trolley-order-summary--accordion" data-auto="accordion"><button                        class="accordion--button" aria-controls="accordion-order-summary" aria-expanded="false"                        type="button"><span class="accordion--title">View more</span><span                            class="accordion--icon icon-chevron-down-small-blue"></span></button><div class="accordion--content" id="accordion-order-summary"><div></div></div></div></div></div><div class="trolley-order-summary--button hidden-small-medium -trolley"><div data-auto="continue-checkout-button" class="trolley-order-summary--button"><div class="button-with-feedback undefined"><a id="export-btn-tesco-tools-monkey" href="#" class="button button-primary">Export Bucket</a><div class="spinner hidden"></div></div></div></div></div></div>')
    const d = document.querySelector('#main > div.main__content > div > div.trolley--wrapper > div > div > div.full-trolley--grid > div.full-trolley--content > div:nth-child(3) > div')
    d.append(toolsNode)

    function createNewItemLists(newList, oldList) {
        return newList.map(newItem => {
            const oldItem = oldList.find(oldItem => oldItem.id === newItem.id)
            if (oldItem) {
                newItem.newValue += oldItem.newValue
            }
            return newItem
        })
    }

    async function getCurrentCart() {
        const emptyItemsPayload = { "items": [], "returnUrl": "/groceries/en-IE/trolley" }
        return await putItems(emptyItemsPayload)
    }

    // await putItems(payload)

    const importTextarea = document.querySelector('#import-area-tesco-tools-monkey')
    const importBtn = document.querySelector('#import-btn-tesco-tools-monkey')

    const exportTextarea = document.querySelector('#export-area-tesco-tools-monkey')
    const exportBtn = document.querySelector('#export-btn-tesco-tools-monkey')

    let repeatClickImport = false;

    importBtn.addEventListener('click', async (event) => {
        if (repeatClickImport) {
            throw new Error('Duplicated import is not allowed')
        }
        repeatClickImport = true;
        event.preventDefault();
        const textarea = document.querySelector('#import-area-tesco-tools-monkey').value
        const importedItemList = JSON.parse(textarea)
        const currentItemList = await getCurrentCart()

        const newItemList = createNewItemLists(importedItemList, currentItemList)

        const payload = {
            returnUrl: "/groceries/en-IE/trolley",
            items: newItemList,
        }
        await putItems(payload)
        location.reload();
    })

    exportBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const list = await getCurrentCart()
        const content = JSON.stringify(list)
        document.querySelector('#export-area-tesco-tools-monkey').textContent = content
    })
})();


