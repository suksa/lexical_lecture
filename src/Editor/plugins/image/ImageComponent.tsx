import React, { useEffect, useRef, useState } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { $isImageNode } from "./ImagePlugin";
import useSWR from 'swr'

const ImageComponent = ({ src, nodeKey }: any) => {
  const { data, mutate } = useSWR('activeImage')

  const [stayActive, setStayActive] = useState(false);
  const [isPrevParagraph, setIsPrevParagraph] = useState(false)
  const [isNextNull, setIsNextNull] = useState(false)

  const imageRef = useRef<null | HTMLImageElement>(null);

  const [editor] = useLexicalComposerContext();

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  const onClick = (event: any) => {
    event.stopPropagation();

    mutate(nodeKey)
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

  const onClickMove = (event: any, direction: 'up' | 'down') => {
    event.stopPropagation();

    editor.update(() => {
      
      const node = $getNodeByKey(nodeKey);
      if (direction === 'up') {
        const prev = node.getPreviousSibling()
        if (prev) {
          prev.insertBefore(node);
        }
      } else {
        const next = node.getNextSibling()
        if (next) {
          next.insertAfter(node);
        }
      }

    });

    // const targetBlockElem = getBlockElement(anchorElem, editor, event);

    
  }

  const onClickP = (direction: 'top' | 'bottom') => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return
      if (direction === 'top') {
        node?.insertBefore($createParagraphNode())
        $setSelection(node.selectPrevious());
      } else {
        node?.insertAfter($createParagraphNode())
        $setSelection(node.selectNext());
      }
    })
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

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      // onChange(editorState);
      // console.log(editorState)
      
      editorState.read(() => {

        const node = $getNodeByKey(nodeKey);
        const prev = node?.getPreviousSibling()
        const next = node?.getNextSibling()
        setIsPrevParagraph(prev?.__type === 'paragraph')
        setIsNextNull(next === null)
      });

    });
  }, [editor, nodeKey]);
  


  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        {!isPrevParagraph && <button onClick={() => onClickP('top')} style={{ position: "absolute", top: -10, left: -10, width: document.querySelector('#editor').clientWidth, opacity: 0.8 }}>add paragraph</button>}
        {isNextNull && <button onClick={() => onClickP('bottom')} style={{ position: "absolute", bottom: -10, left: 0, right: 0, width: document.querySelector('#editor').clientWidth, opacity: 0.8 }}>add paragraph</button>}
        <button
            onClick={onClick}
            style={{ position: "absolute", top: 10, left: 10, background: data === nodeKey ? 'red' : '#eee' }}
          >
            on
        </button>
        {isSelected && (
          <>
            <button
              onClick={onClickDelete}
              style={{ position: "absolute", top: 10, left: 50 }}
            >
              delete
            </button>
            <button
              onClick={(e) => onClickMove(e, 'up')}
              style={{ position: "absolute", bottom: 10, left: 10 }}
            >
              up
            </button>
            <button
              onClick={(e) => onClickMove(e, 'down')}
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
