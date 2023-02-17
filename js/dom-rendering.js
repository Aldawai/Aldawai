



/**
 * 
 * @param {string} condition 
 * @param {HTMLElement} child 
 */

function Verify(condition, child) {
    if (condition === 'rend-if') {
        let attributes = child.getAttributeNames();
        // console.log(child);
        let control = false;
        attributes.forEach((attribute) => {
            if (attribute == 'rend-if') {
                control = true;
            }
        });
        if (control == true) {
            let value = child.getAttribute('rend-if');
            if (eval(value) == false) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

/**
 * 
 * @param {string} renderingCondition 
 * @returns {NodeList[]}
 */

function getElements(renderingCondition) {
    renderingCondition = renderingCondition.replaceAll(' ', '');
    let targets = document.querySelectorAll(`*[${renderingCondition}]`);
    return targets;
}

// getConditionnalElements();

/**
 * Get all the children of the {HTMLElement} passed as argument
 * @param {HTMLElement} element 
 * @returns {NodeList[]}
 */



function elementsTree(element, condition) {
    let elementFound = [];
    let children = element.children;
    if (children.length == 0) {
        return null;
    }

    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        elementFound.push(child);
        if (child.children.lenght != 0) {
            let found = elementsTree(child);
            if (found) {
                if (found.length != 0) {
                    elementFound.push(...found);
                }
            }
        }
    };

    return elementFound;
}

function Apply_RendIf() {
    let rendIf = getElements('rend-if');
    rendIf.forEach(child => {
        let value = child.getAttribute('rend-if');
        if (eval(value) == false) {
            child.remove();
        }
    });
}

function Apply_RendFor() {
    let rendFor = getElements('rend-for');
    let varName;
    let forLoop;
    rendFor.forEach((child, index) => {
        let iterator = child.getAttribute('rend-for');
        forLoop = `
    for(${iterator}) {

    }
    `
    });
}

Apply_RendIf();


