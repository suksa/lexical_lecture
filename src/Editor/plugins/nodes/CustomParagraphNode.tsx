import { EditorConfig, EditorThemeClasses, ParagraphNode } from "lexical";

function getCachedClassNameArray(
    classNamesTheme: EditorThemeClasses,
    classNameThemeType: string,
  ): Array<string> {
    const classNames = classNamesTheme[classNameThemeType];
    // As we're using classList, we need
    // to handle className tokens that have spaces.
    // The easiest way to do this to convert the
    // className tokens to an array that can be
    // applied to classList.add()/remove().
    if (typeof classNames === 'string') {
      const classNamesArr = classNames.split(' ');
      classNamesTheme[classNameThemeType] = classNamesArr;
      return classNamesArr;
    }
    return classNames;
  }

export class CustomParagraphNode extends ParagraphNode {
    static getType(): string {
        return 'custom-paragraph';
    }
    
    static clone(node: ParagraphNode): ParagraphNode {
    return new ParagraphNode(node.__key);
    }
    
    createDOM(config: EditorConfig): HTMLElement {
        const dom = document.createElement('p');
        const classNames = getCachedClassNameArray(config.theme, 'paragraph');
        dom.tabIndex = 0
        if (classNames !== undefined) {
            const domClassList = dom.classList;
            domClassList.add(...classNames);
        }
        return dom;
    }
}
