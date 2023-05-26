import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  EditorConfig,
  ElementNode,
  LexicalNode,
  NodeKey,
  RangeSelection,
} from "lexical";

export class BannerNode extends ElementNode {
  constructor(key?: NodeKey) {
    super(key);
  }

  static getType(): string {
    return "banner";
  }

  static clone(node: BannerNode): BannerNode {
    return new BannerNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("div");
    element.className = config.theme.banner;
    return element;
  }

  // 업데이트 필요 없음
  updateDOM(): false {
    return false;
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection?: boolean | undefined
  ): LexicalNode | null {
    const newBlock = $createParagraphNode();
    const direction = this.getDirection();
    newBlock.setDirection(direction);
    this.insertAfter(newBlock, restoreSelection);
    return newBlock;
  }

  collapseAtStart(): boolean {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }
}

// 어휘규칙
export function $createBannerNode(): BannerNode {
  return new BannerNode();
}

// 해당 노드가 배너노드인지
export function $isBannerNode(node: LexicalNode): node is BannerNode {
  return node instanceof BannerNode;
}

export const INSERT_BANNER_COMMAND = createCommand("INSERT_BANNER_COMMAND");

export function BannerPlugin(): null {
  const [editor] = useLexicalComposerContext();
  if (!editor.hasNodes([BannerNode])) {
    throw new Error("배너 노드가 등록되지 않았습니다");
  }
  editor.registerCommand(
    INSERT_BANNER_COMMAND,
    () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, $createBannerNode);
      }
      return true;
    },
    COMMAND_PRIORITY_LOW
  );

  return null;
}
