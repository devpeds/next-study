"use client";

import {
  cloneElement,
  ReactElement,
  Ref,
  RefCallback,
  useEffect,
  useRef,
} from "react";

const eventTypeMap = {
  click: "onClick",
  touchstart: "onTouchStart",
  focusout: "onBlur",
} as const;

type EventType = keyof typeof eventTypeMap;

type EventHandlerName = (typeof eventTypeMap)[EventType];

type Event = MouseEvent | TouchEvent | FocusEvent;

type ChildrenProps = {
  ref?: Ref<unknown> | null;
} & {
  [key in EventHandlerName]?: (event: Event) => void;
};

type Props = {
  children: ReactElement<ChildrenProps>;
  onClickAway: () => void;
};

function mergeRefs<T>(...refs: Ref<T>[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

function ClickAwayListener({ children, onClickAway }: Props) {
  const nodeRef = useRef<HTMLElement>(null);
  const bubbledEventTarget = useRef<EventTarget>(null);

  const childRef = children.props?.ref || null;
  const combinedRef = mergeRefs(nodeRef, childRef);

  useEffect(() => {
    const nodeDocument = nodeRef.current?.ownerDocument || document;

    const handleEvent = (event: Event) => {
      if (!nodeRef.current) {
        return;
      }

      const target = event.target as Node;
      if (
        nodeRef.current.contains(target) ||
        bubbledEventTarget.current === target ||
        !nodeDocument.contains(target)
      ) {
        return;
      }

      onClickAway();
    };

    nodeDocument.addEventListener("click", handleEvent);
    nodeDocument.addEventListener("touchstart", handleEvent);
    nodeDocument.addEventListener("focusout", handleEvent);

    return () => {
      nodeDocument.removeEventListener("click", handleEvent);
      nodeDocument.removeEventListener("touchstart", handleEvent);
      nodeDocument.removeEventListener("focusout", handleEvent);
    };
  }, [onClickAway]);

  const handleBubbledEvent =
    (handlerName: EventHandlerName) => (event: Event) => {
      bubbledEventTarget.current = event.target;
      children.props[handlerName]?.(event);
    };

  return cloneElement(children, {
    ref: combinedRef,
    ...Object.fromEntries(
      Object.entries(eventTypeMap).map(([_, handlerName]) => [
        handlerName,
        handleBubbledEvent(handlerName),
      ]),
    ),
  });
}

export default ClickAwayListener;
