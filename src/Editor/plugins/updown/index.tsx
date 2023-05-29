import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, COMMAND_PRIORITY_LOW, createCommand } from 'lexical';
import React from 'react'

export const IMAGE_UP_COMMAND = createCommand("IMAGE_UP_COMMAND");

// export function BannerPlugin(): null {
//   const [editor] = useLexicalComposerContext();
//   if (!editor.hasNodes([BannerNode])) {
//     throw new Error("배너 노드가 등록되지 않았습니다");
//   }
//   editor.registerCommand(
//     INSERT_BANNER_COMMAND,
//     () => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, $createBannerNode);
//       }
//       return true;
//     },
//     COMMAND_PRIORITY_LOW
//   );

//   return null;
// }


const Updown = () => {
    const [editor] = useLexicalComposerContext()

    editor.registerCommand(
        IMAGE_UP_COMMAND,
        (payload) => {
            const selection = $getSelection();
            const nodes = selection?.getNodes()
            if (nodes.length === 1 && nodes[0].__type === 'image' ) {
                if (payload === 'up') {
                    const prev = nodes[0].getPreviousSibling()
                    if (prev) {
                        prev.insertBefore(nodes[0]);
                    }
                } else {
                    const prev = nodes[0].getNextSibling()
                    if (prev) {
                        prev.insertAfter(nodes[0]);
                    }
                }
            }

            return true;
        },
        COMMAND_PRIORITY_LOW
    );

    const onClick = (payload:any) => {
        editor.dispatchCommand(IMAGE_UP_COMMAND, payload);
    };

    return <>
        <button onClick={() => onClick('up')}>up</button>
        <button onClick={() => onClick('down')}>down</button>
    </>;
}

export default Updown