import React, { useEffect, useRef, useState } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $getSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { $isImageNode } from "./ImagePlugin";

const ImageComponent = ({ src, nodeKey }: any) => {
  const [stayActive, setStayActive] = useState(false);

  const imageRef = useRef<null | HTMLImageElement>(null);

  const [editor] = useLexicalComposerContext();

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  const onClick = (event: any) => {
    event.stopPropagation();

    alert(1);
  };

  const onClickDelete = (event: any) => {
    event.stopPropagation();

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        $setSelection(node.selectPrevious());
        node.remove();
      }
    });
  };

  const onClickMove = (event: any) => {
    event.stopPropagation();
  }

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === imageRef.current) {
            if (!event.shiftKey) {
              clearSelection();
              setSelected(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );

    return () => {
      unregister();
    };
  }, [clearSelection, editor, setSelected]);

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        {isSelected && (
          <>
            <button
              onClick={onClick}
              style={{ position: "absolute", top: 10, left: 10 }}
            >
              on
            </button>
            <button
              onClick={onClickDelete}
              style={{ position: "absolute", top: 10, left: 50 }}
            >
              delete
            </button>
            <button
              onClick={onClickMove}
              style={{ position: "absolute", bottom: 10, left: 10 }}
            >
              up
            </button>
            <button
              onClick={onClickMove}
              style={{ position: "absolute", bottom: 10, left: 50 }}
            >
              down
            </button>
          </>
        )}
        <img src={src} width={300} height={300} ref={imageRef} />
      </div>
    </>
  );
};

export default ImageComponent;
