import { Allotment } from "allotment";
import { Content } from "./Content";
import styles from "./TestApp.module.css";

export default function TestApp() {
  return (
    <div className={styles.container}>
      <Allotment>
        <Content />
        <Content />
      </Allotment>
    </div>
  );
}
