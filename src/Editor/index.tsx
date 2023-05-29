import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  ParagraphNode,
  type EditorState,
} from "lexical";
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { TreeView } from "@lexical/react/LexicalTreeView";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import {
  BannerNode,
  BannerPlugin,
  INSERT_BANNER_COMMAND,
} from "./plugins/banner/BannerPlugin";
import {
  ImageNode,
  ImagePlugin,
  INSERT_IMAGE_COMMAND,
} from "./plugins/image/ImagePlugin";
import { CustomParagraphNode } from "./plugins/nodes/CustomParagraphNode";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import Updown from "./plugins/updown";

const theme = {
  // Theme styling goes here
  text: {
    italic: "glyf-editor-italic",
  },
  banner: "glyf-editor-banner",
  image: "img_wrap",
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!

// function onChange(editorState: any) {
//   editorState.read(() => {
//     // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();

//     // console.log(root, selection);
//     // console.log(root.getChildren())
//     const nodesFromState = Array.from(editorState._nodeMap.values());
//     console.log(nodesFromState)
//     nodesFromState.forEach(v => {
//       if (v.__type === 'paragraph') {
//         v.remove()
//       }
//     })
//     // root.getChildren().forEach((v) => {
//     //   v.remove()
//     // })
//   });
// }

function MyOnChangePlugin() {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);

  return null;
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function MyHeadingPlugin() {
  const [editor] = useLexicalComposerContext();

  const onClick = (tag: "h1" | "h5") => {
    editor.update(() => {
      //   const root = $getRoot();
      //   root.append($createHeadingNode("h1").append($createTextNode("hello")));

      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // 선택종류: 그리드선택 범위선택 노드선택
        // 범위선택인지

        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <>
      {(["h1", "h5"] as const).map((v) => (
        <button onClick={() => onClick(v)} key={v}>
          {v} heading
        </button>
      ))}
    </>
  );
}

function InsertBannerBtn() {
  const [editor] = useLexicalComposerContext();

  const onClick = () => {
    editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined);
  };
  return <button onClick={() => onClick()}>배너</button>;
}

function InsertImageBtn() {
  const [editor] = useLexicalComposerContext();

  const onClick = () => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, undefined);
  };
  return <button onClick={() => onClick()}>이미지</button>;
}

function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="tree-view-output"
      treeTypeButtonClassName="debug-treetype-button"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      editor={editor}
    />
  );
}

function onError(error: Error) {
  console.error(error);
}

function Editor() {
  const { data, mutate } = useSWR('activeImage')
  
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      BannerNode,
      ImageNode,
      // CustomParagraphNode,
      // {
      //     replace: ParagraphNode,
      //     with: (node: ParagraphNode) => {
      //         return new CustomParagraphNode();
      //     }
      // }
    ],
  };

  useEffect(() => {
    mutate('3')
  }, [])
  

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable id="editor" />}
          placeholder={<div></div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* <OnChangePlugin onChange={onChange} /> */}
        {/* <MyOnChangePlugin onChange={(editorState) => console.log(editorState)} /> */}
        <HistoryPlugin />
        <MyHeadingPlugin />

        <BannerPlugin />
        <InsertBannerBtn />

        <ImagePlugin />
        <InsertImageBtn />

        <Updown />

        <MyCustomAutoFocusPlugin />

        <TreeViewPlugin />

        {/* <NodeEventPlugin
            nodeType={CustomParagraphNode}
            eventType={'focus'}
            eventListener={(e: Event) => {
                alert('Nice!');
            }}
        /> */}
      </LexicalComposer>
    </>
  );
}

export default Editor;
