/* eslint-disable react-refresh/only-export-components */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister, $insertNodeToNearestRoot } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_LOW,
  createCommand,
  EditorConfig,
  DecoratorNode,
  type NodeKey,
  DOMExportOutput,
  LexicalNode,
  COMMAND_PRIORITY_EDITOR,
  LexicalEditor,
  Spread,
  SerializedEditor,
  SerializedLexicalNode,
  DOMConversionMap,
  DOMConversionOutput,
  $createTextNode,
} from "lexical";
import { useEffect } from "react";
import ImageComponent from "./ImageComponent";
import { $setBlocksType } from "@lexical/selection";

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { src } = domNode;
    const node = $createImageNode({ src });
    return { node };
  }
  return null;
}

export type SerializedImageNode = Spread<
  {
    src: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  static __src: string;

  constructor(src: string, key?: NodeKey) {
    console.log("node: constructor");
    super(key);
    this.__src = src;
  }

  static getType(): string {
    console.log("node: getType");
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    console.log("node: clone");
    return new ImageNode(node.__src, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    console.log("node: createDOM");
    const span = document.createElement("div");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src } = serializedNode;
    const node = $createImageNode({
      src,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.getSrc(),
      type: "image",
      version: 1,
    };
  }

  updateDOM(): false {
    console.log("node: updateDOM");
    return false;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    console.log("node: decorate");
    return <ImageComponent src={this.__src} nodeKey={this.getKey()} />;
  }

  getSrc(): string {
    return this.__src;
  }
}

// 어휘규칙
export function $createImageNode({ src }: { src: string }): ImageNode {
  console.log("plugin: $createImageNode()");
  return new ImageNode(src);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  console.log("plugin: $isImageNode()");
  return node instanceof ImageNode;
}

export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

export function ImagePlugin(): null {
  console.log("plugin: ImagePlugin()");
  const [editor] = useLexicalComposerContext();
  if (!editor.hasNodes([ImageNode])) {
    throw new Error("이미지 노드가 등록되지 않았습니다");
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        () => {
          console.log("plugin: registerCommand()");
          const imageNode = $createImageNode({ src: "/img.jpg" });
          $insertNodeToNearestRoot(imageNode);

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
