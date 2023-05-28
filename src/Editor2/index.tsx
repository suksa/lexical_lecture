import React, { HTMLAttributes, createElement, useEffect, useRef } from 'react'
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';

function isPlaintextOnlySupported() {
    try {
        const element = document.createElement("div");
        element.contentEditable = "plaintext-only";
        return element.contentEditable === "plaintext-only";
    } catch {
        return false
    }
}

const isPlaintextOnly = isPlaintextOnlySupported()

const ImageComponent = () => {
    return (
        <div contentEditable={false}>
            <button type="button" >버튼</button>
            <img src="/img.jpg" alt="이미지 설명" width={200} height={200} />
        </div>
    )
}

const Editor2 = () => {

    const editorRef = useRef(null)
    const selectionRef =useRef(null)
    
    
    const onClickTest = () => {
        // const selection = window.getSelection()
        // const range = new Range();
        // console.log(document.createRange())

        const p = document.querySelector('#p')
        
        // const range = new Range();
        // range.setStart(p?.firstChild, 2);
        // range.setEnd(p.querySelector('b')?.firstChild, 2);
        // console.log(range)
    //     range.selectNodeContents(p.querySelector('b'))

    //     const t = document.createElement('span')
    //     t.textContent = '안뇽'
    //     range.insertNode(t)

    //     range.setStart(p.childNodes[2], 1)
    //     range.setEnd(p.childNodes[2], p.childNodes[2].length - 1)
    //     const b = document.createElement('b')
    //     range.surroundContents(b)
        
    //     document.getSelection().removeAllRanges();
    // document.getSelection().addRange(range);

    // const selection = document.getSelection()
    // const range = selection.getRangeAt(0);
    // console.log(range)
        // document.getSelection().setBaseAndExtent(p, 0, p, p.childNodes.length);


        const selection = window.getSelection();
        console.log(selection)
        const range = selection.getRangeAt(0);
        console.log(range)
    }

    const onKeyDown = (event) => {
        if (!isPlaintextOnly && event.key === 'Enter') {
            document.execCommand('insertLineBreak')
            event.preventDefault()
        }
    }

    const onClickImage = () => {
        const contentEditableNode = editorRef.current;

        const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // 이전 커서 위치에 <div> 요소 생성
    const divNode = document.createElement('div');
    divNode.textContent = '안녕'
    range.insertNode(divNode);

    // <div> 다음에 '\n' 문자 삽입
    const newlineNode = document.createTextNode('\n');
    divNode.parentNode.insertBefore(newlineNode, divNode.nextSibling);

    // <div> 뒤에 빈 텍스트 노드 생성
    const emptyTextNode = document.createTextNode('');
    divNode.parentNode.insertBefore(emptyTextNode, newlineNode.nextSibling);

    // 커서 위치 이동
    range.setStartAfter(emptyTextNode);
    range.setEndAfter(emptyTextNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // contentEditable 요소 갱신
    contentEditableRef.current.focus();
    }
    

  return (
    <div>
        <Edit contentEditable={(isPlaintextOnly ? 'plaintext-only' : 'true') as any} key="edit" onKeyDown={onKeyDown} ref={editorRef} id="edit">
            {/* <p id="p">Example: <i>italic</i> and <b>bold</b></p> */}
        </Edit>
        <ul>
            <li><button onClick={onClickTest}>test</button></li>
            <li><button onClick={onClickImage}>이미지</button></li>
        </ul>
    </div>
  )
}

const Edit = styled.div`
    width: 500px;
    height: 500px;
    overflow-y: auto;
    border: 1px solid #aaa;
    padding: 8px;
    /* display: inline-block; */
`

export default Editor2