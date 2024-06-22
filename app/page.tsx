"use client"

import clsx from 'clsx';
import { GeistMono } from 'geist/font/mono';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { v4 } from 'uuid';
import { wrap } from '@/utils';
import TodoItem from '@/components/todo-item';
import { ChevronDown, ChevronUp, Pause, Play } from 'react-feather';

type Todo = {
  id: string;
  text: string;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([{ id: v4(), text: '' }, { id: v4(), text: '' }, { id: v4(), text: '' }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [footerOpen, setFooterOpen] = useState(false);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const [focusMinute, setFocusMinute] = useState(.1);
  const focusSeconds = useMemo(() => focusMinute * 60, [focusMinute]);
  const [breakMinute, setBreakMinute] = useState(.5);
  const breakSeconds = useMemo(() => breakMinute * 60, [breakMinute]);
  const [isFocus, setIsFocus] = useState(true);

  const index = wrap(0, todos.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const addNewTodo = () => {
    setTodos(todos => [...todos, { id: v4(), text: '' }]);
    setPage([todos.length, -1]);
  }

  const toggleFooter = () => {
    setFooterOpen(c => !c);
  }


  return (
    <main className="flex flex-col bg-gray-1 text-gray-12" style={{ height: '100dvh' }}>
      <div className="flex justify-between p-4">
        <h1>ツ</h1>
        <div className={clsx(GeistMono.className, 'text-sm')}>{index + 1}/{todos.length}</div>
      </div>
      <div className='relative flex-1 overflow-hidden flex'>
        <AnimatePresence
          mode='popLayout'
        >
          <motion.div
            className='flex-1 flex flex-col pt-64 items-center'
            key={todos[index].id}
            custom={direction}
            variants={variants}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20, restSpeed: 0.01, restDelta: 0.001 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <TodoItem
              key={todos[index].id}
              id={todos[index].id}
              text={todos[index].text}
              onTextChange={(text) => {
                setTodos(todos => todos.map((todo, i) => i === index ? { ...todo, text } : todo));
              }}
              createNewTodo={() => {
                setTodos(todos => {
                  const newTodos = [...todos];
                  newTodos.splice(index + 1, 0, { id: v4(), text: '' });
                  return newTodos;
                });
                setActiveIndex(activeIndex + 1);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
