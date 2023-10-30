import { useEffect, useState } from "react";
import { Doc } from "yjs";

export const useSharedDocument = ({
  sharedKey,
  valueToShare,
  document: doc,
}: {
  sharedKey: string;
  valueToShare: any;
  document: Doc | null;
}) => {
  const [sharedValue, setSharedValue] = useState({ label: "Plain Text", value: "plaintext" });
  useEffect(() => {
    if (!doc) return;
    console.log("detect language change");
    // shared data type
    // reference: https://docs.yjs.dev/getting-started/working-with-shared-types
    const ymap = doc.getMap("language");
    doc.transact(() => {
      ymap.set(sharedKey, valueToShare);
    });

    ymap.observe((e) => {
      if (e?.target?._map.get(sharedKey)?.content.getContent().length === 0) return;
      setSharedValue(e?.target._map.get(sharedKey)?.content.getContent()[0]);
    });
  }, [doc, valueToShare, sharedKey]);

  return {
    sharedValue,
  };
};
