import React, { useEffect, useRef, useState } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";

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
      <div style={{ position: "relative" }}>
        {isSelected && (
          <button
            onClick={onClick}
            style={{ position: "absolute", top: 10, left: 10 }}
          >
            on
          </button>
        )}
        <img src={src} width={300} height={300} ref={imageRef} />
      </div>
    </>
  );
};

export default ImageComponent;
