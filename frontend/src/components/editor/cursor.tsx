import { HocuspocusProvider } from "@hocuspocus/provider"
import { useEffect, useMemo, useState } from "react"

export const Cursor = ({ yProvider }: { yProvider: HocuspocusProvider }) => {
  const awareness = yProvider.awareness
  const [users, setUsers] = useState<any>([])

  useEffect(() => {
    const set = () => {
      if (!awareness) {
        return
      }
      setUsers(Array.from(awareness.getStates()))
    }

    yProvider.awareness?.setLocalStateField("user", {
      name: awareness?.doc.clientID, // todo: @didy replace with user name when integrate with user service
      color: Math.floor(Math.random() * 16777215).toString(16) // todo: @didy replace with real colors instead of random colors
    })

    yProvider.awareness?.on("change", set)
    set()

    return () => {
      awareness?.off("change", set)
    }

  }, [yProvider])

  const styleSheet = useMemo(() => {
    let cursorStyles = "";
    for (let i = 0; i < users.length; i++) {
      const [clientId, client] = users[i]

      // TODO @didy: refactor to use chakra ui component
      if (client?.user) {
        cursorStyles += `
          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${client.user.color};
          }

          .yRemoteSelectionHead-${clientId}::after {
            content: "${client.user.name}";
            position: absolute;
            top: -1.4em;
            left: -2px;
            padding: 2px 6px;
            background-color: #ff45f4;
            color: ${client.user.color};
            border: 0;
            border-radius: 6px;
            border-bottom-left-radius: 0;
            line-height: normal;
            white-space: nowrap;
            font-size: 14px;
            font-family: var(--font-sans);
            font-style: normal;
            font-weight: 600;
            pointer-events: none;
            user-select: none;
            z-index: 1000;
          }
        `;
      }
    }

    return { __html: cursorStyles };
  }, [users])

  return <style dangerouslySetInnerHTML={styleSheet} />
}