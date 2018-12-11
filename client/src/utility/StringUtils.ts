// Given an dictionary of {string, boolean}, builds a space-delimited
// string of classes to apply to a DOM element.  Only values with a
// 'true' boolean value will be included
export interface ClassDictionary { [className: string]: boolean; }
export const buildClassString = (classNames: ClassDictionary): string => {
    const finalClassNames: string[] = [];
    Object.keys(classNames).forEach(className => {
        if (classNames[className] === true) {
            finalClassNames.push(className);
        }
    });
    return finalClassNames.join(' ');
};