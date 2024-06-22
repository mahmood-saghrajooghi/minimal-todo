import isHotkey from 'is-hotkey';
import { motion, AnimatePresence } from "framer-motion";
import { v4 } from 'uuid';
import { createInflateRaw } from 'zlib';

type Props = {
  id: string;
  text: string;
  createNewTodo: () => void;
  onTextChange: (text: string) => void;
}

export default function TodoItem({ id, text, createNewTodo, onTextChange }: Props) {
  return (
    <textarea
      className='bg-transparent w-5/6 outline-none resizable-textarea'
      placeholder='What needs to be done?'
      onKeyDown={(e) => {
        if (isHotkey('alt+shift+n', e)) {
          e.preventDefault();
          e.stopPropagation();
          createNewTodo()
        }
      }}
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
    />
  )
}
